---
id: cyber-09-cloud-and-identity
track: cyber
phase: 9
order: 90
title: "Phase 9 — Cloud and Identity Security"
duration: "6 weeks"
duration_weeks: 6
energy_mix: [low, normal]
deliverable: "portfolio/cyber/09-cloud-and-identity.md"
exit_criteria: "You can read a cloud activity log, explain who did what and whether it was expected, secure an identity with MFA and least privilege, and write a finding about a misconfigured cloud resource."
---

# Phase 9 — Cloud and Identity Security

## Goal of this phase

Learn how cloud environments are attacked and defended, why identity is the control plane that matters most, and how to read cloud audit logs well enough to answer “who did this, and should they have been able to?”

## Estimated time

**6 weeks** at roughly 1.5–2 focused hours a day, 5 days a week. Roughly 40–56 hours total.

## Skills you'll gain

- Explain the shared responsibility model and say precisely which controls are yours in each cloud service model.
- Read and interpret an IAM policy in AWS or Azure and identify what it actually allows, not what it appears to allow.
- Configure MFA in Microsoft Entra ID at no cost, and explain what a conditional access policy does and where the free tier stops.
- Recognise the five cloud misconfigurations that cause most real breaches.
- Read cloud audit logs — AWS CloudTrail and Azure Activity Log — and reconstruct a sequence of actions.
- Explain what a service principal, managed identity, and instance metadata service are, and why the metadata endpoint is a target.
- Write a cloud security finding with evidence, business impact, and a specific remediation.

## Specific topics to learn

- Shared responsibility model across IaaS, PaaS, and SaaS
- Cloud identity: users, groups, roles, service principals, managed identities
- IAM policy structure: effect, action, resource, condition, principal
- Least privilege and permission boundaries
- Microsoft Entra ID (formerly Azure AD) free tier and what it includes
- Conditional access: signals, decisions, and what free licensing permits
- MFA types: app push, TOTP, FIDO2, and which ones resist phishing
- Service accounts versus human accounts, and why service accounts are the weak point
- Cloud storage misconfiguration: public buckets, ACLs, and object-level exposure
- Cloud logging: AWS CloudTrail, Azure Activity Log, Entra sign-in logs
- The instance metadata service at `169.254.169.254` and SSRF
- Credential theft paths: long-lived access keys, exposed secrets in repositories, token theft
- Over-permissive roles and privilege escalation through `iam:PassRole` and similar
- Cloud versus on-premises differences that change how you defend
- Cloud security posture management concepts and free-tier equivalents

## Lesson: Identity Is the New Perimeter

### Why this lesson exists

Every phase before this one described a world with walls. You hardened a host, segmented a network, monitored traffic crossing a boundary. Those skills are still correct, and they are no longer sufficient.

In a cloud environment there is no perimeter to defend. There is an application programming interface, an identity that authenticates to it, and a log that records what that identity did. That is the whole shape of the thing.

This changes the defender's job in a way that surprises people who learned security on premises. The question stops being *“did traffic cross my firewall?”* and becomes *“which identity did this, was it supposed to, and who granted it that ability?”*

**The evidence for this is in the breach reports.** For several years running, the dominant initial access vector in cloud incidents has been stolen credentials and misconfigured services, not software exploits. Verizon's Data Breach Investigations Report has consistently found that the majority of breaches involve a human element — credential misuse, phishing, or error. IBM's Cost of a Data Breach work has repeatedly identified compromised credentials and cloud misconfiguration among the most common and most expensive initial access vectors.

Read that carefully, because it reframes the whole subject. **The attacker is not breaking the encryption. They are logging in with a valid account that has too much permission.**

If that is the threat model, then the defence is not a bigger firewall. It is fewer permissions, shorter-lived credentials, stronger authentication, and logs good enough to notice when something is wrong.

This phase teaches that defence, entirely on free tiers.

#### What you already have, and why it is more than you think

You are not starting from nothing. You have three things this phase builds directly on.

| What you have | Where it came from | How this phase uses it |
|---|---|---|
| Identity fundamentals — authentication, authorisation, accounting | Phase 3 | Cloud IAM is those three ideas expressed as JSON |
| Log-reading discipline | Phase 4 (reinforced later in Phase 10) | CloudTrail records are just another log source |
| A working lab habit | Phase 4 | Free-tier cloud accounts are labs with the same rules |

The vocabulary is genuinely new — tenant (your organisation's own directory in the cloud), subscription (the billing and management container your resources live in, not a paid plan by itself), principal, and role assumption. The underlying ideas are not.

#### Time to complete

**Roughly 40–56 hours over 6 weeks**, split approximately:

| Work | Hours | Notes |
|---|---|---|
| Reading this lesson | 4–6 | Once, properly |
| Free Microsoft Entra ID tenant setup and identity work | 6–8 | No card, no cost |
| AWS free-tier account, IAM, and CloudTrail reading | 10–14 | Free tier, but set a budget alarm in the first hour |
| Reading and writing IAM policies | 8–10 | The slowest and most valuable part |
| Storage misconfiguration lab | 4–6 | Build it, expose it, detect it, fix it |
| Finding write-up and deliverable | 8–12 | The artifact that proves you can do this |

#### What this phase is not

This is not a certification study phase. It is not a cloud engineering phase either — you will not learn to design a multi-region architecture here.

It is a **defender's** phase. You are learning to read what the cloud recorded, and to configure the controls that appear in nearly every cloud incident report.

### Part 1 — The shared responsibility model, without the marketing

#### Who secures what

Every cloud provider publishes a shared responsibility model diagram. They are all variations on the same idea, and the idea is easy to state and easy to misread.

**The provider secures the cloud. You secure what you put in it.**

That sentence is correct and almost useless on its own, because “what you put in it” means a different amount of work depending on which service model you are using.

| Service model | Example | You secure | Provider secures |
|---|---|---|---|
| **IaaS** — Infrastructure as a Service | A virtual machine | The OS, patches, the application, the data, firewall rules, identities, and the VM's network configuration | The physical hosts, the hypervisor, the storage substrate, and the network fabric |
| **PaaS** — Platform as a Service | A managed database, an app service | The application, the data, and the identities that reach it | The OS, the runtime, patching, and the platform's own configuration baseline |
| **SaaS** — Software as a Service | Microsoft 365, a CRM | Your users, your data, and your sharing settings | Everything else, including the application itself |

Read the **IaaS** row again, because it is where beginners get burned. Renting a virtual machine does not transfer patching to Amazon or Microsoft. You still own the operating system. The provider owns the building; you own everything from the hypervisor up.

#### Why the model matters to a defender

The shared responsibility model is usually taught as a vendor slide. For a defender it answers a much more practical question: **when something goes wrong, whose fault is it, and whose job is the fix?**

| Incident | Under the model, who failed | What the fix looks like |
|---|---|---|
| A storage bucket left publicly readable | You | Configuration review, detection rule, guardrails |
| A hypervisor escape in the provider's fleet | The provider | Nothing you can do; the provider patches it |
| An unpatched Linux VM you rented | You | Your patch process, which you must actually build |
| A Microsoft 365 account with no MFA that got phished | You | Your identity configuration |
| A provider-wide outage | The provider | Your availability design, which is a resilience question rather than a security one |

That third row is the one that causes incidents. Teams move to the cloud, assume patching is included, and inherit an estate of unpatched servers they never agreed to own.

#### Worked example: the same workload, three models

Consider a simple web application with a database. Here is what you own in each model.

| Task | On a VM (IaaS) | On a managed app platform (PaaS) | On a hosted product (SaaS) |
|---|---|---|---|
| Patch the operating system | **You** | Provider | Provider |
| Patch the runtime and database engine | **You** | Provider | Provider |
| Configure TLS certificates | You | You, usually via the platform | Provider |
| Manage who can log in | **You** | **You** | **You** |
| Decide what data the application stores | **You** | **You** | **You** |
| Set the database to reject public connections | **You** | **You** | Not applicable |
| Encrypt data at rest | You configure it | Provider default, you verify | Provider |
| Keep the audit log | **You** | **You**, and this is commonly forgotten | Provider keeps it; you read it |

The bottom two rows are the interesting ones. **Identity and logging stay yours in every model.** No provider will decide who should have access to your data, and no provider will read your audit log for you.

That is not an accident of the pricing tiers. It is the direct consequence of what you alone can define: what counts as normal for your organisation.

### Part 2 — Cloud identity: IAM, told plainly

#### The four words that unlock everything

Cloud identity is built from a small vocabulary, and almost all confusion in IAM traces back to blurring these four.

| Term | What it is | The question it answers |
|---|---|---|
| **Principal** | An identity that can make a request — a user, a group, a role, or a service | *Who is asking?* |
| **Action** | The specific operation being requested | *What do they want to do?* |
| **Resource** | The specific object the action targets | *What do they want to do it to?* |
| **Policy** | A document saying which principals may take which actions on which resources, under which conditions | *Are they allowed?* |

A request in the cloud is evaluated as: this **principal** wants to perform this **action** on this **resource** — does any attached **policy** allow it?

Every cloud provider implements this slightly differently, and every one implements it in this shape. Learn the shape once and you can read any of them.

#### Users, roles, and service principals

The second distinction that matters is between identity *types*, because they have very different risk profiles.

| Identity type | What it represents | Long-lived? | Primary risk |
|---|---|---|---|
| **Human user account** | A person | Yes | Phishing, weak MFA, credential reuse |
| **Group** | A collection of users, for bulk assignment | Yes | Becoming an accidental privilege-granting mechanism |
| **Role** | A set of permissions that can be assumed temporarily | No, sessions expire | Over-permissive definitions; confused-deputy problems |
| **Service principal** | A non-human identity an application authenticates as | Usually yes, and this is the problem | Secrets that never rotate, stored in code or config |
| **Managed identity** | A service principal whose credentials the platform manages and rotates | No | Far lower — you cannot leak what you never hold |

**The single most useful security idea in that list is the managed identity.** It exists because service principals with static secrets are a persistent source of real breaches. A managed identity has no credential for you to store, so there is nothing to commit to a repository or paste into a configuration file.

If a platform offers a managed identity, that is almost always the right answer over a long-lived access key. The preference order is: managed identity, then short-lived assumed role, then long-lived key — and the long-lived key is last for good reason.

#### What an IAM policy actually says

Policies are JSON documents, and learners routinely read them as if the words described intent. They do not. They describe *permission*, and permission is broader than intent every time.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowListingOfProjectBucket",
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::company-project-data"
    },
    {
      "Sid": "AllowObjectReadWriteInReportsPrefix",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::company-project-data/reports/*"
    }
  ]
}
```

Read that policy three times, as three different people.

| Reader | Question | Answer from this policy |
|---|---|---|
| The engineer who wrote it | *Can my application read and write its reports?* | Yes |
| An attacker who stole the credential | *What is the furthest I can reach?* | List the whole bucket, and read or overwrite anything under `reports/` |
| An auditor | *Is write access necessary, and is it bounded?* | Not established. Write is granted without a condition |

Three readers, one document, three different conclusions. **Reading a policy for what it allows rather than what it was meant to allow is the core skill of this phase.**

#### The permission audit habit

Here is a habit worth building now, because it transfers to every cloud and every job. For any policy you write or review, ask five questions in order.

| Question | Why it catches problems |
|---|---|
| **1. What is the broadest action in this list?** | Wildcards like `s3:*` or `*` hide enormous reach behind four characters |
| **2. Where does the resource end?** | `arn:...:bucket/*` covers every object in the bucket; a narrower prefix often suffices |
| **3. Is there a condition?** | Conditions are what turn a broad grant into a safe one — source IP, MFA present, a tag value |
| **4. Who else can assume or attach this?** | A tight policy attached to a role anyone can assume is a broad policy in practice |
| **5. If this credential leaked today, what is the worst outcome?** | The only question that matters, and the one that produces the finding |

That fifth question is the one you will use in interviews, and it is the one that produces a remediation instead of a complaint.

You can answer the first two mechanically, without reading a policy by eye.

**Before any of this works you need the AWS CLI**: install it, then run `aws configure` once with the IAM user's access key, secret, and a default region. Every command below reads those stored credentials, so a bare `aws` command with no configuration fails immediately.

**Where to run these commands.** The blocks in this phase are POSIX shell — `while read`, `$(...)`, backslash line continuations, `2>/dev/null` — and they will not run in PowerShell. On Windows, use WSL2, Git Bash, or the Ubuntu VM from Phase 2 if you have the RAM for one. `wsl --install` from an elevated prompt installs Ubuntu in one command.

Install the AWS CLI *inside* whichever shell you choose, and run `aws configure` there, so the credentials land in that shell's own home directory. If you paste one of these loops into PowerShell and get a wall of syntax errors, the shell is the problem and not you. The same applies to the S3 loop in Part 5.

```bash
# Every policy attached to one identity, in one pass.
aws iam list-attached-user-policies --user-name svc-reporting

# The actual document behind a managed policy, so you can read the actions.
# The version id must be the policy's *default* version, which is v1 for AWS
# managed policies but is arbitrary for customer-managed ones. Read it first:
aws iam get-policy --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess \
  --query 'Policy.DefaultVersionId' --output text
aws iam get-policy-version \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess \
  --version-id v1 --query 'PolicyVersion.Document'

# Find every customer-managed policy that grants a wildcard action.
# Hardcoding --version-id v1 here would silently skip every policy whose
# default version is not v1, which is most of them. Ask for the real one.
aws iam list-policies --scope Local --query 'Policies[].Arn' --output text | \
  while read -r p; do
    v=$(aws iam get-policy --policy-arn "$p" \
          --query 'Policy.DefaultVersionId' --output text 2>/dev/null)
    aws iam get-policy-version --policy-arn "$p" --version-id "$v" 2>/dev/null \
      --query 'PolicyVersion.Document' \
      | grep -qE '"Action"[[:space:]]*:[[:space:]]*"(\*|[a-z0-9-]+:\*)"' \
      && echo "WILDCARD: $p"
  done
```

Two details in that third command are worth naming, because both are the kind of thing that makes an audit script quietly wrong. The version id has to be fetched rather than assumed, and the `grep` pattern is written loosely enough to catch the several shapes a wildcard action takes — `"Action": "*"`, `"Action":"*"` with no space, and service-level wildcards such as `"Action": "s3:*"` — because the CLI's JSON is not formatted the way you would write it by hand.

That third command is the shape of a real audit task. It is not elegant, it is exactly the kind of thing a junior analyst is asked to produce in their first month, and it produces a list that goes straight into a report.

#### Worked example: the developer who needed read access

A junior developer asks for access to production logs to debug a customer issue. The expedient answer is to attach an existing policy.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DeveloperLogAccess",
      "Effect": "Allow",
      "Action": [
        "logs:DescribeLogGroups",
        "logs:DescribeLogStreams",
        "logs:GetLogEvents",
        "logs:FilterLogEvents",
        "logs:DeleteLogGroup",
        "logs:PutRetentionPolicy"
      ],
      "Resource": "*"
    }
  ]
}
```

The request was read access. Two of the six actions are destructive, and every resource in the account is in scope.

| Element | What was asked for | What was granted | Fix |
|---|---|---|---|
| Actions | Read log events | Read, plus delete a log group and change retention | Remove `DeleteLogGroup` and `PutRetentionPolicy` |
| Resources | One service's logs | Every log group in the account | Scope to the specific log group ARN |
| Duration | Debug one issue | Permanent | Attach as an assumable role with a session limit |
| Condition | None | None | Require MFA, and restrict source to the corporate range if possible |

Revised:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DeveloperReadCheckoutServiceLogs",
      "Effect": "Allow",
      "Action": [
        "logs:DescribeLogStreams",
        "logs:FilterLogEvents"
      ],
      "Resource": "arn:aws:logs:ap-southeast-1:123456789012:log-group:/aws/checkout-service:*",
      "Condition": {
        "Bool": {"aws:MultiFactorAuthPresent": "true"}
      }
    }
  ]
}
```

The developer can still do the job. The credential, if stolen, can read logs for one service and nothing else.

**This is what least privilege looks like in practice.** Not a policy that denies everything, but the smallest set of permissions that leaves the work possible.

#### Why least privilege is hard, and what to do about it

Least privilege is easy to state and genuinely difficult to operate, for reasons worth naming honestly.

| Obstacle | What actually happens | Practical response |
|---|---|---|
| Nobody knows what is needed at first | Teams grant broadly to avoid blocking work | Grant broadly once, then review with real usage data |
| Usage data is needed to tighten | Access analyser tools exist but need time to accumulate | Turn on logging first, tighten in a second pass |
| Breaking production has a cost | Fear of an outage keeps stale permissions alive | Test in a non-production account first |
| Permissions accumulate | A person changes teams; the old access stays | Scheduled access reviews, at least quarterly |
| Emergency access is genuinely needed | Break-glass accounts are legitimate | Keep them, log them, alert on their use, review every use |

That last row matters for credibility. A defender who says “remove all standing access” has not operated a system. A defender who says “standing access for the routine case, break-glass for the emergency, and an alert whenever break-glass fires” has.

#### MFA, and which factors actually stop an attacker

Multi-factor authentication is the single highest-value identity control available, and not all MFA is equivalent.

| Factor type | How it works | Resists phishing? | Notes |
|---|---|---|---|
| **SMS code** | A code is texted to a number | No | Vulnerable to SIM swapping and real-time relay; better than nothing |
| **App push** | A prompt appears in an app | Partly | Vulnerable to MFA fatigue — the attacker spams prompts until the user approves |
| **Number matching** | A push that displays a number to type | Partly | Defeats blind push approval, still relayable in real time |
| **TOTP code** | A rotating code from an app | No | The code can be typed into an attacker's page in real time |
| **FIDO2 / passkey** | A hardware key or platform authenticator bound to the origin | **Yes** | The credential is origin-bound, so a lookalike site cannot use it |

The row worth dwelling on is the last one. FIDO2 and passkeys resist phishing for a structural reason rather than a policy reason: the authenticator checks the site's origin, and a phishing domain does not match. There is no code for the user to hand over.

**The trap for beginners:** treating “we have MFA” as a control description. It is not. “We have MFA, and the primary factor is push with number matching, and we alert on repeated push denials” is a control description.

### Part 3 — Entra ID and conditional access on a free tenant

#### What the free tier actually gives you

Microsoft Entra ID — the service formerly called Azure AD — is the identity system behind Microsoft 365, and it is the identity system most Philippine enterprises and BPO environments run.

You can create a free tenant with no credit card. That is a genuinely valuable lab, because the concepts transfer directly to every other cloud's identity system.

| Capability | Entra ID Free | What it means for you |
|---|---|---|
| User and group management | Yes | Create users, groups, and dynamic membership |
| Security defaults | Yes | A baseline that enforces MFA registration for all users |
| Self-service password reset for cloud users | Yes | Useful to understand as a support scenario |
| Sign-in and audit logs (limited retention) | Yes, with limits | Enough to see failed sign-ins and MFA events |
| Conditional access | **No** — requires P1 or higher | The important limitation, covered below |
| Identity Protection risk detections | No — requires P1 or higher | Risk-based policies are a paid feature |
| Privileged Identity Management | No — requires P2 | Just-in-time elevation is paid |

**The honest limitation:** conditional access and risk-based policies need Entra ID P1, which is a paid licence. This phase does not require you to buy one.

You can still learn conditional access properly in three free ways, and all three are legitimate.

| Free way to learn it | How it works |
|---|---|
| **Security defaults** | Free baseline that enforces MFA for everyone. Study what it does and what it cannot do |
| **A time-limited trial** | Microsoft periodically offers trial licences. Treat it as an evaluation, not a plan, and do not enter payment details you cannot honour |
| **Microsoft Learn sandboxes** | Free guided exercises that cover conditional access concepts in a provided environment |

The third is the reliable route on a $0 budget. The material is free and the concepts are what you are after.

#### Conditional access, explained as a sentence

Conditional access is an `if-then` statement for authentication, and the value is that it moves the security decision from a global setting to a contextual one.

**If** these signals are true, **then** apply this control.

| Signals — the “if” | Controls — the “then” |
|---|---|
| Who the user is, and which group they are in | Block access entirely |
| Which application they are reaching | Require MFA |
| The device: is it compliant, is it managed, is it joined? | Require a compliant device |
| The location: named network, trusted IP, or unknown | Require a hybrid-joined device |
| The client app: browser, mobile, desktop, legacy protocol | Require an app protection policy |
| Sign-in risk, or user risk | Require a password change |
| | Limit session duration, or force re-authentication |

A realistic policy reads like this:

> If a user is in the `Finance` group, and they are accessing the finance application, and the sign-in comes from outside the corporate network, then require MFA and a compliant device.

That single policy replaces a lot of improvised reasoning. It also answers the question a manager actually asks — *“what stops a stolen password?”* — with a specific, testable answer.

#### The four policies worth understanding first

If you learn four policy patterns, you can reason about almost any conditional access conversation.

| Policy | Signals | Control | What it stops |
|---|---|---|---|
| **MFA for all users, all apps** | Any interactive sign-in | Require MFA | Stolen-password reuse from anywhere |
| **Block legacy authentication** | Client app is a legacy protocol | Block | Protocols that cannot enforce MFA at all — a very common bypass |
| **Require compliant device for admins** | User holds an admin role | Require compliant, managed device | Admin credential theft being useful from an unmanaged laptop |
| **Block high-risk sign-ins** | Sign-in risk is high | Block, or require password change | Anomalous locations, impossible travel, leaked credentials |

The **legacy authentication** row deserves a note, because it is the one learners skip. Older mail and authentication protocols — POP, IMAP, SMTP AUTH, and older Office clients — cannot present an MFA prompt. An attacker with a stolen password can often use one of them to bypass MFA entirely.

If conditional access is the lock on the front door, legacy authentication is a window that was never closed.

#### The MFA registration phone call

There is a support scenario in this material worth learning now, because it happens constantly and it is a security decision disguised as a helpdesk ticket.

A user calls the service desk and says they have a new phone and cannot approve MFA prompts. What happens next determines whether your organisation's MFA is a control or a formality.

| Step | Weak practice | Better practice |
|---|---|---|
| Verify identity | Ask for their employee ID and date of birth | Ask for something only the user and HR would know, and check the request against recent account activity |
| Check the account | Look at the display name | Read the sign-in log and the audit log for recent MFA method changes |
| Reset the factor | Delete all methods and let them re-enrol, immediately | Delete, re-enrol, and confirm the user is physically present on a known device |
| Record | Close the ticket | Note the verification method used, because it is audit evidence |

The **audit log check** is the step beginners skip and attackers depend on. If someone registered a new authenticator on that account yesterday from an unfamiliar location, the caller may not be the account owner at all — and “I got a new phone” is the standard pretext for exactly that attack.

That is the whole reason the identity verification discipline from the service desk phase applies to cloud identity. The helpdesk is the attacker's route to an MFA reset, and the reset is how a stolen password becomes a stolen account.

#### Worked example: a sign-in log that tells a story

You are looking at the Entra sign-in logs. Here is a plausible sequence for one account, and what it might mean.

| Time (UTC) | Result | Application | Location | Client app | Device |
|---|---|---|---|---|---|
| 01:14 | Success | Office 365 | Manila, PH | Browser | Registered |
| 04:52 | Failure — invalid password | Office 365 | Lagos, NG | Other clients | Unregistered |
| 04:53 | Failure — invalid password | Office 365 | Lagos, NG | Other clients | Unregistered |
| 04:54 | **Success** | Office 365 | Lagos, NG | Other clients | Unregistered |
| 04:56 | Success — MFA registered | My Sign-Ins | Lagos, NG | Browser | Unregistered |

Two stories fit this evidence.

| Interpretation | Supporting evidence | Against it |
|---|---|---|
| **The user is travelling and forgot their password temporarily** | Password eventually succeeded | The location change is abrupt; a new MFA method was registered minutes later |
| **The account was compromised by password spraying, then the attacker enrolled their own MFA method** | Failures then success from one unfamiliar location, `Other clients` indicating legacy auth, immediate MFA registration | None of it is impossible for a legitimate traveller |

**The defender's rule: you do not have to decide alone.** The correct next step is not to conclude. It is to contain the account and contact the user through a channel the attacker does not control.

| Step | Action | Why this order |
|---|---|---|
| 1 | Revoke the account's sessions and refresh tokens | Stops an active attacker immediately |
| 2 | Reset the password | Invalidates the credential the attacker holds |
| 3 | Remove MFA methods that were added in the suspicious window | Otherwise the attacker keeps a way back in |
| 4 | Contact the user out of band — a phone call, not email | The mailbox may be under attacker control |
| 5 | Review what the account did between the two events | Scope the damage before you close the ticket |

That fifth step is where a junior analyst adds real value, and where the cloud logs from Part 4 become essential.

**The trap this example exists to name:** `Other clients` and `Other` client-app values appear in legacy authentication traffic. A defender who does not know that will read the log as a normal browser sign-in and close the ticket.

### Part 4 — Reading cloud logs

#### What each log source answers

Cloud logging feels overwhelming until you sort the sources by the question each one answers.

| Log source | Answers | Where it lives |
|---|---|---|
| **AWS CloudTrail** | Which identity called which API, from where, when, and with what result | AWS account, per region, plus a global service view |
| **Azure Activity Log** | Which control-plane operations happened on which resources | Azure subscription |
| **Entra sign-in logs** | Which user signed in to which application, from where, with which client | Entra ID |
| **Entra audit logs** | Which identity and directory changes were made — user created, role assigned, app registered | Entra ID |
| **VPC flow logs** | Which network connections were attempted between which addresses | AWS VPC |
| **S3 access logs** | Which object in which bucket was accessed by whom | AWS S3 |
| **Microsoft 365 unified audit log** | Mailbox, file, and sharing activity | Microsoft 365 |

The distinction that organises all of them is **control plane versus data plane**.

| Plane | What it covers | Example event | Why it matters |
|---|---|---|---|
| **Control plane** | Configuration and permissions — the management API | Create a user, attach a policy, disable logging | Attackers love it: it is how persistence is built |
| **Data plane** | The data itself — reads and writes of content | Download an object, read a row, send an email | This is the actual harm |

**The beginner trap:** monitoring only one plane. A team that watches data access but not permission changes will miss the attacker who grants themselves access and then reads quietly for weeks.

#### CloudTrail: the fields that matter

A CloudTrail event is a JSON record. You do not need to read all of it. You need six fields.

```json
{
  "eventTime": "2026-03-11T04:54:22Z",
  "eventSource": "iam.amazonaws.com",
  "eventName": "AttachUserPolicy",
  "awsRegion": "us-east-1",
  "sourceIPAddress": "203.0.113.44",
  "userAgent": "aws-cli/2.15.0 Python/3.11",
  "userIdentity": {
    "type": "IAMUser",
    "principalId": "AIDAEXAMPLE123456789",
    "arn": "arn:aws:iam::123456789012:user/svc-reporting",
    "accountId": "123456789012"
  },
  "requestParameters": {
    "userName": "svc-reporting",
    "policyArn": "arn:aws:iam::aws:policy/AdministratorAccess"
  },
  "responseElements": null,
  "errorCode": null
}
```

| Field | What it tells you | Why a defender cares |
|---|---|---|
| `eventName` | The API call that happened | The verb. `AttachUserPolicy` is a permission change, not a read |
| `userIdentity.arn` | Which identity made the call | Answering “who” precisely, including whether it was a service or a human |
| `sourceIPAddress` | Where the call came from | A known office range versus an unfamiliar address |
| `userAgent` | What client made the call | `aws-cli` at 3 a.m. from a service account is worth a look |
| `requestParameters` | The details of the request | This is where you see *what* was granted — `AdministratorAccess` here |
| `errorCode` | Whether it failed | A burst of `AccessDenied` events is reconnaissance |

That example event is a self-escalation. The identity `svc-reporting` attached the AWS-managed `AdministratorAccess` policy to itself. Nothing was exploited; a permission was used that should not have existed.

**This is what cloud attacks look like on paper.** Not a buffer overflow — an API call that was allowed.

#### The detections worth writing first

You do not need a commercial product to detect the important things. CloudTrail and Activity Log are free, and a handful of event names cover a large share of real incidents.

| Detection | AWS signal | Azure or Entra signal | Why it matters |
|---|---|---|---|
| **Logging disabled** | `StopLogging`, `DeleteTrail` | Activity Log: delete a diagnostic setting | The first thing a competent attacker does |
| **Self-escalation** | `AttachUserPolicy`, `PutUserPolicy`, `CreatePolicyVersion` | Role assignment creation with Owner or Contributor | Privilege escalation without exploiting anything |
| **New access key created** | `CreateAccessKey` | App registration secret added | Persistence that outlives a password reset |
| **Root or global admin used** | `userIdentity.type` is `Root` | Global Administrator sign-in | High-privilege accounts should be rare and loud |
| **Bucket made public** | `PutBucketAcl`, `PutBucketPolicy`, `PutPublicAccessBlock` deleted | Storage account public access enabled | Data exposure with no exploitation step |
| **New identity created** | `CreateUser`, `CreateRole` | User created, guest invited | Attackers create accounts to survive remediation |
| **MFA device added or removed** | Not in CloudTrail; use Entra | Audit log: authentication method registered | An attacker enrolling their own second factor |
| **Unusual region activity** | API calls in a region you never use | Resources created in an unusual location | Common in cryptomining and exfiltration |

Read the first row again. **Attacks against cloud logging are the rule, not the exception**, and a detection rule that fires on `StopLogging` is one of the highest-value rules you can write.

#### Worked example: reconstructing an incident from CloudTrail

You are handed an alert: an S3 bucket containing customer exports was made public. Here is the CloudTrail sequence, in order, filtered to one identity.

| Time (UTC) | eventName | Source IP | Reading |
|---|---|---|---|
| 04:41:12 | `GetCallerIdentity` | 203.0.113.44 | The attacker confirming which credentials they hold |
| 04:41:30 | `ListBuckets` | 203.0.113.44 | Enumerating what is reachable |
| 04:42:02 | `ListUsers` | 203.0.113.44 | Reconnaissance, and a sign the key is over-permissive |
| 04:44:19 | `CreateAccessKey` | 203.0.113.44 | **Persistence** — a second credential now exists |
| 04:47:55 | `GetBucketAcl` | 203.0.113.44 | Checking the current state before changing it |
| 04:48:10 | `PutBucketAcl` | 203.0.113.44 | **The exposure** |
| 04:52:31 | `GetObject` × 214 | 198.51.100.7 | A *different* address is now downloading the data |
| 05:03:44 | `StopLogging` | 203.0.113.44 | Attempting to blind the defender |

What this sequence tells you, and what it does not.

| Question | Answer from this evidence |
|---|---|
| What was the initial access? | An access key was used. The log does not say how it leaked — check repositories, CI configuration, and the key's creation date |
| Was it a human or automation? | `userAgent` of `aws-cli` plus the pattern suggests scripted activity, possibly a human at a terminal |
| What was the blast radius? | The bucket's contents were downloadable by a second address. 214 objects is the exposure count |
| Is the attacker still present? | Yes. `CreateAccessKey` created a credential that survives a password reset |
| What was the containment priority? | Delete the new access key, revoke the original, re-enable logging, then set the bucket private |

**The remedy order matters.** Deleting the created access key first, before touching the original credential, is what stops the attacker re-entering. Analysts who rotate the original key first and forget the new one find the attacker back inside an hour later.

#### Wrong first guess: two addresses, one actor

That table reads as though the analyst knew the answer from the first row. Nobody does. Here is the same sequence as it actually arrives — one event at a time, with the first reading written down and then overturned.

**First reading.** At 04:52 the analyst sees 214 `GetObject` calls against the customer-exports bucket from `198.51.100.7`. That address has never appeared in this account before. It is a different address, in a different range, doing a different thing: the earlier activity was management API calls from `203.0.113.44`, and this is bulk data retrieval.

The plausible conclusion is **a second actor**. It is plausible for good reasons, and those reasons are worth stating plainly.

| Why the first reading was reasonable | The evidence for it |
|---|---|
| The address is different | `203.0.113.44` did all the reconnaissance and configuration; `198.51.100.7` did all the downloading |
| The behaviour is different | One identity changed permissions and made keys; the other only read objects |
| The timing is different | The management calls cluster in a seven-minute burst; the downloads run for eleven minutes afterwards |
| A second party arriving after exposure is common | Once a bucket is public, unrelated scanners find it within hours, and they look exactly like this |

So the analyst writes the tentative conclusion: **the original actor exposed the bucket, and an unrelated party found and harvested it.** That is a defensible reading, and it changes the response.

**What overturned it.** Two details, both from fields already on the page.

| Detail | What it shows |
|---|---|
| The `userAgent` string is byte-identical | Both addresses present the same client string, down to the version. Independent scanners rarely match an attacker's tooling exactly |
| The gap is suspiciously tidy | Downloads begin 4 minutes 21 seconds after `PutBucketAcl`, with no scanning delay. An unrelated finder needs time to discover the bucket — the discovery step is missing entirely |

The second detail is the stronger one. A bucket opened at 04:48 and harvested at 04:52 has not been *found*; it has been *expected*. An attacker who already knows the bucket name does not need to scan for it.

**Revised conclusion.** One actor used a second egress path — a different host, a VPN exit, or a container in another account — for the high-volume, high-attribution part of the operation. The first address is the control path; the second is the data path.

| Reading | Verdict | Why |
|---|---|---|
| Two unrelated actors | Plausible, then rejected | Identical `userAgent` and a four-minute gap with no discovery step |
| One actor, two egress paths | Consistent with all the evidence | Explains both the identical tooling and the missing discovery delay |
| Still unresolved | What cannot be settled from CloudTrail alone | Which of the two addresses was the human, and whether a third path exists |

**The honest ending matters as much as the revision.** CloudTrail cannot tell you whether the two addresses are the same person, the same malware, or two operators working from one playbook. What it can tell you is that treating them as unrelated is the weaker hypothesis, so your containment must cover both.

| What the revision changes | Because |
|---|---|
| The scope of credential revocation | Two paths mean at least two credential sets to hunt, not one |
| The containment priority | Blocking `203.0.113.44` alone would leave the download path untouched |
| The report's language | “One actor” is a finding; “two actors” is speculation the evidence does not support |

**The habit this teaches:** write your first reading down before you check it, because a conclusion you never recorded is a conclusion you cannot audit. The revision above is not a mistake. It is the work.

**A caution about both readings.** The `userAgent` string is attacker-controlled. A careful adversary can copy any client string they like, so identical tooling is evidence, not proof. Treat it as one strong signal among several, and say so when you write it up.

### Part 5 — The five failures that cause most cloud incidents

#### Failure 1 — The public storage bucket

This is the most reported cloud misconfiguration in the world, and it is worth understanding why it keeps happening.

Object storage is private by default in every major cloud. It becomes public because a human changes a setting — usually to make something work, often under time pressure.

| How it becomes public | The setting involved | The tell |
|---|---|---|
| A bucket policy granting `Principal: "*"` | Bucket policy JSON | `"Principal": "*"` with an `Allow` and no condition |
| An ACL granting `AllUsers` read | Legacy ACL | `grantee` of `AllUsers` or `AuthenticatedUsers` |
| An account-level block turned off | Public access block | The four `BlockPublicAcls`-family settings disabled |
| An object made public individually | Object ACL | Per-object grants, which bucket-level reviews miss |
| A signed URL shared too widely | Pre-signed URL | Not a misconfiguration, but indistinguishable in outcome |

The fifth row is the subtle one and the one beginners miss. A pre-signed URL is a legitimate feature that grants temporary access to one object. Shared in a public channel, it leaks exactly like a public bucket — and no configuration review will flag it.

**The detection approach:** monitor the *configuration changes*, not the current state. A nightly scan that reports public buckets is a day late. An alert on `PutBucketAcl` and `PutBucketPolicy` fires at the moment of change.

```bash
# Three independent checks per bucket, because public access can arrive
# through any of them, and a block on one does not close the others.
aws s3api list-buckets --query 'Buckets[].Name' --output text | \
  while read -r b; do
    printf '=== %s\n' "$b"
    printf '  block:  '
    aws s3api get-public-access-block --bucket "$b" \
      --query 'PublicAccessBlockConfiguration' --output json 2>/dev/null \
      || echo 'NO BLOCK CONFIGURED'
    printf '  policy: '
    aws s3api get-bucket-policy-status --bucket "$b" \
      --query 'PolicyStatus.IsPublic' --output text 2>/dev/null \
      || echo 'NO POLICY'
    printf '  acl:    '
    aws s3api get-bucket-acl --bucket "$b" \
      --query 'Grants[?Grantee.URI!=`null`].Grantee.URI' --output text 2>/dev/null \
      | grep -q . && echo 'PUBLIC GRANT' || echo 'no public grant'
  done
```

That command is a finding generator, and it is deliberately three checks rather than one. `NO BLOCK CONFIGURED` is a finding on its own, but it is not the whole story: a bucket *with* a block configured can still be public through a bucket policy, and `get-bucket-policy-status` is the call that answers that. Read the three lines together — a bucket is clean only when the block is present, the policy status reads `false`, and the ACL shows no public grant.

The one-check version of this script, which asks only about the block, reports a bucket as safe after a policy has already opened it. That is the same defect as the disabled event log in Phase 10 and the unloaded auditd rule: a check that looks like it ran, and did not measure what you thought.

#### Failure 2 — Over-permissive roles

The second failure is the one that turns a small compromise into a large one. It rarely looks like a mistake, because the policy was written to make something work.

| Pattern | What it looks like | Why it is dangerous |
|---|---|---|
| The wildcard action | `"Action": "*"` | Full administrative reach, usually justified as “it is only a service account” |
| The wildcard resource | `"Resource": "*"` with a narrow action | Often fine for read-only APIs, disastrous for `iam:` or `s3:` |
| The trusted-anyone role | `"Principal": {"AWS": "*"}` | Any AWS account can assume it, if a condition is missing |
| The confused deputy | A role that trusts a service, combined with an attacker-controlled parameter | The role acts on the attacker's behalf |
| The leftover admin | An engineer's old admin role, still attached | Nobody remembers it, and it is still usable |

The **confused deputy** deserves a plain explanation, because the name is unhelpful. The idea: a role trusts Service A to assume it. If Service A can be made to act on a resource the attacker controls, the attacker can borrow the role's permissions without ever holding a credential. The fix is an external ID or a tightly scoped condition, not a policy review.

#### Failure 3 — Long-lived credentials

Every cloud supports long-lived access keys. They are convenient, they are the default in most tutorials, and they are a leading cause of cloud breaches.

| Credential | Lifetime | Where it leaks | Better option |
|---|---|---|---|
| AWS access key and secret | Until deleted | Code repositories, CI variables, screenshots, support tickets | IAM role with temporary credentials |
| Azure app registration client secret | Usually 1–2 years | Configuration files, deployment pipelines | Managed identity, or federated credentials |
| Service account JSON key | Until rotated | Developer laptops, shared drives | Workload identity federation |
| Personal access token | Often no expiry | Shell history, notes apps, wikis | Short expiry with scoped permissions |
| Session token | Minutes to hours | Nowhere useful to an attacker who is not already present | This is the goal — the rest are fallbacks |

**The defender's rule:** a credential you can copy is a credential that will be copied. Managed identities and federation exist so that the answer to “where is the secret stored?” becomes “there is no secret.”

#### Failure 4 — The metadata service and SSRF

Every cloud virtual machine exposes a link-local address that answers a single question: *what identity does this machine have?*

| Cloud | Metadata endpoint | What it returns |
|---|---|---|
| AWS | `http://169.254.169.254/latest/meta-data/` | Instance metadata, including role credentials at `.../iam/security-credentials/<role>` |
| Azure | `http://169.254.169.254/metadata/instance?api-version=...` | Instance metadata, with a required `Metadata: true` header |
| Google Cloud | `http://metadata.google.internal/computeMetadata/v1/` | Instance metadata, with a required `Metadata-Flavor: Google` header |

The AWS path that matters is the one that returns credentials:

```bash
# On a VM with an attached role. This returns temporary credentials.
curl -s http://169.254.169.254/latest/meta-data/iam/security-credentials/
curl -s http://169.254.169.254/latest/meta-data/iam/security-credentials/my-app-role
```

The response contains an `AccessKeyId`, a `SecretAccessKey`, and a `Token`, plus an expiry. Anyone who can make the server perform an HTTP request on their behalf can read those values.

That is **server-side request forgery (SSRF)**, and it is why SSRF against cloud-hosted applications is treated as a credential-theft vulnerability rather than an information-disclosure bug. You will meet SSRF again in Phase 14, from the web application side.

```bash
# A pinned four-step exploit shape, for understanding detection only.
# Victim application fetches a user-supplied URL, without validation.
http://169.254.169.254/latest/meta-data/iam/security-credentials/
http://169.254.169.254/latest/meta-data/iam/security-credentials/app-role
# The JSON response now contains usable temporary credentials.
# Those credentials inherit every permission the instance role holds.
```

**Why this is a cloud-specific trap.** On premises, reaching a link-local address usually yields nothing valuable. In the cloud, that one address is a credential-dispensing service. The same code is harmless in one environment and a full compromise in the other.

| Defence layer | What it does |
|---|---|
| IMDSv2 | Requires a session token obtained by a `PUT` request, which a simple SSRF cannot perform |
| Egress filtering | Blocks the instance from reaching `169.254.169.254` unless required |
| URL allowlisting | The application only fetches from known hosts |
| Scoped instance roles | Limits what the stolen credential can actually do |
| Egress-proxy logging | Leaves evidence that the metadata service was queried |

The last layer is the one a defender adds. You cannot always prevent the request; you can almost always notice it.

#### Failure 5 — Identity sprawl

The fifth failure is not a setting. It is the slow accumulation of identities nobody is tracking.

| Symptom | How it happens | Why it matters |
|---|---|---|
| Dormant accounts with access | An employee leaves; the account stays enabled | A credential nobody is watching |
| Guest accounts from old projects | External collaborators invited once, never removed | An access path outside your control |
| Service principals with no owner | A tool was evaluated and abandoned | A secret in a config file you no longer read |
| Duplicate accounts per person | Different teams create their own | Four ways in for one person |
| Admin roles held by non-admins | Granted for one task, never removed | Standing privilege with no justification |

**The free control that finds all of this:** an access review. Export the identity list with last-sign-in dates, sort by oldest, and ask of each row whether the access is still justified. It costs nothing, it is what auditors ask for, and it is the first task in this phase's task list.

### Part 6 — Cloud versus on-premises, for a defender

#### Where the defender's job genuinely changes

Students often ask whether cloud security is a different field. The honest answer: the principles are identical and the mechanics are different enough to require deliberate learning.

| Dimension | On premises | In the cloud |
|---|---|---|
| **Perimeter** | A network boundary you can point at | An API with authentication; there is no boundary to point at |
| **Identity** | Active Directory, often with broad trust | Every cloud has its own IAM, and federation ties them together |
| **Provisioning speed** | Weeks, with a change process | Seconds, self-service, no ticket |
| **Configuration state** | Usually documented, often drifted | Entirely code, and entirely API-driven |
| **Logging** | Centralised, or not, depending on maturity | Available by default in many services, and off in others |
| **Who can change things** | Administrators and change control | Anyone with a policy that allows the API call |
| **Evidence** | Host logs, network captures, disk images | API records, which are richer for *who* and poorer for *what content* |
| **Blast radius** | Bounded by network segmentation | Bounded by policy — and a wildcard policy removes the bound entirely |

Read the last two rows together, because that pairing is the heart of the phase.

Cloud logs are excellent at answering *who did what*. They are much weaker at telling you *what data was in the file that was downloaded*. On premises you might pull a disk image and know exactly; in the cloud you may only know that 214 objects were read.

**That asymmetry changes incident response.** You spend more effort on scope estimation and less on host forensics, and you lean on data-classification records you may not have.

#### What transfers directly from your earlier phases

The reassuring half of the comparison.

| Skill from earlier phases | How it applies in the cloud |
|---|---|
| Reading logs and building a timeline (Phases 3 and 4) | A CloudTrail sequence *is* a timeline; the method is identical |
| Least privilege reasoning (Phase 3) | The same reasoning, expressed in JSON instead of ACLs |
| Order of volatility (Phase 3) | Cloud equivalent: capture the API logs before the retention window rolls |
| Incident report writing (Phase 6) | The same report, with API events as the evidence |
| Segmentation thinking (Phase 2) | Becomes account separation and network policy |
| Vulnerability management (Phase 3) | Becomes image patching and dependency scanning |

If you have done Phase 3's incident timeline and Phase 4's log reading, you already know how to do this. What is new is where the evidence lives. Phases 10 and 11 will return to both skills at greater depth, but nothing here waits on them.

#### The free-tier cost trap, stated plainly

This is the one place in this phase where you can lose real money, so it needs a direct warning.

| Risk | What happens | Prevention |
|---|---|---|
| You leave a resource running | A VM or managed database bills hourly, indefinitely | Delete resources the same day you create them |
| You exceed a free-tier allowance | The account bills the overage without asking | Set a budget alarm with an email notification on day one |
| You lose track of resources across regions | A resource in another region is invisible to your usual view | Check every region, not just the default |
| You enable a paid service by accident | Some consoles upsell during setup | Read the tier label on the confirmation screen |
| Your card is charged | The bill arrives a month later | Use a prepaid or low-limit card if available, and monitor |

**Set a budget alarm before you create anything.** In AWS this is under Billing, and it takes about two minutes. A budget of one US dollar with an email alert is enough to catch the mistake that would otherwise cost you a month's income.

The phase is completable on free tiers and on the Microsoft Entra free tenant. It is not completable if you leave an instance running for three weeks while you do other work.

#### The setup ladder: five rungs, in order

The warning above tells you what can go wrong with cost. It does not tell you what to do when your account will not provision at all, and that is the more common beginner problem.

Work these five rungs **in order**, and do not climb past a rung that is failing. Each one is cheap and takes minutes. Fixing a rung you already passed is far easier than diagnosing a compound failure later.

**Rung 1 — The account or tenant exists and you can sign in.**

*Healthy:* you sign in at the provider's own console with the credentials you just created, from a browser that is not signed in to any other account. The landing page shows your account identifier.

| Common failure | What it looks like | What to check |
|---|---|---|
| You are signed in to the wrong account | The console loads, but the tenant or account name is not yours | Sign out fully, or use a private window. A personal Microsoft account and a work tenant look similar in the URL bar |
| The card verification did not complete | AWS holds the account in a pending state and some services are refused | Check the email for a verification step you skipped; AWS free tier needs a card even when nothing is charged |
| The tenant was created under the wrong domain | Your intended name is taken, so the provider appended a suffix | Read the full `.onmicrosoft.com` or account alias, and record it |
| Email delivery silently failed | You never received the confirmation, so the account is unverified | Check spam, and try a different address rather than re-registering repeatedly |

**Rung 2 — A budget alarm or spending limit is active, and you have seen it fire.**

*Healthy:* the budget exists, it names a small amount, it has an email recipient, and you have deliberately confirmed the alert reaches you. In AWS that is a Budget under Billing with an alert threshold. In Azure it is a Cost Management budget on the subscription.

| Common failure | What it looks like | What to check |
|---|---|---|
| The budget exists but has no notification | The alarm never fires because nobody is told | Open the budget and read the alert recipients, do not assume the default |
| The threshold is set to zero dollars | Free-tier usage trips it constantly, so you learn to ignore it | One or two US dollars catches a mistake without crying wolf |
| The alert goes to an address you do not read | The mail arrives somewhere you never look | Use your primary address, and send yourself a test notification |
| You created resources before the budget | The order was wrong, so an early mistake is unmonitored | Set the budget now, and delete anything already running |

**Do not climb to rung 3 until rung 2 is done.** The warning earlier in this part exists because this is the rung beginners skip, and it is the only rung where skipping costs money.

**Rung 3 — One identity that is denied everything by default, and you can prove it is denied.**

*Healthy:* you have an IAM user or a role with **no** policy attached, and an explicit attempt to use it fails with a denial. That failure is the success condition.

| Common failure | What it looks like | What to check |
|---|---|---|
| The identity inherits permissions | The denial never happens, because a group or an account-level policy grants access | Check group membership and any attached managed policies. A new user with no groups should be denied everything |
| You tested with the root or global admin | Everything succeeds, so the test proves nothing | Test with the new identity's own credentials, in its own session |
| The denial came from a typo, not a policy | You get an error, but it is an authentication failure rather than an authorisation one | Read the error code. `AccessDenied` is the one you want; a credential error is a different problem |
| The identity has a wildcard policy "for now" | It works, and it will still be there in six months | Remove it now. A temporary permission is a permanent permission |

Capture the denial output. In this phase that output is evidence, and Part 7 asks you to re-run checks and paste results.

**Rung 4 — CloudTrail or Activity Log records your own API call.**

*Healthy:* you make one deliberate, harmless call — read your own identity, or list the trail itself — then find that exact event in the log, with the right time, identity, and source address. You have now watched logging work rather than assuming it.

| Common failure | What it looks like | What to check |
|---|---|---|
| The trail exists but is not logging | The configuration page looks right and no events arrive | Check the trail status, and the specific region you are calling from |
| You are looking in a different region | The call happened in one region and you are reading another | CloudTrail is per-region for most services; switch the console region or query the event history |
| You waited too little | Recent events take a few minutes to appear | Wait, then refresh. This is not a failure yet |
| The event is there and you cannot read it | The JSON is present but the fields are unfamiliar | Go back to the six fields in Part 4 and find each one in your own event |

**Rung 5 — Only now build anything.**

Everything after this rung is the phase's actual lab work: the bucket, the policies, the detections, the finding. You climb to it with a working account, a spending guard, a proven denial, and proven logging.

| Why the order matters | What breaks without it |
|---|---|
| Cost safety first | A runaway resource with no alarm is the one way this phase costs real money |
| Denial before permission | You cannot recognise over-permission until you have seen correct denial |
| Logging before detection | A detection you cannot verify is a rule you are guessing at |

**When the ladder itself will not start:** if rung 1 fails repeatedly, stop and use a provider sandbox instead. Microsoft Learn sandboxes and AWS workshops give you a live environment for a fixed session at no cost, and Part 8 lists them. A beginner who spends a week fighting account provisioning has learned nothing about cloud security. **You may only work in accounts you own or have written authorisation for**, and a sandbox you were granted access to counts as authorised.

### Part 7 — Writing a cloud finding

#### The finding is the deliverable

The exit criterion for this phase is not “I created a cloud account.” It is being able to write a finding someone can act on. The structure mirrors Phase 6's report anatomy, sharpened for cloud work.

```text
## Finding <n> — <one-line description>

**Severity:** Critical | High | Medium | Low
**Affected resource:** <ARN, resource ID, or subscription-scoped path>
**Detection source:** <the log event or configuration check that found it>

### Description
What the issue is, in two or three sentences, in plain language.

### Evidence
The API event, the policy JSON, or the configuration output, quoted.
Include timestamps and the identity involved.

### Impact
What an attacker could do with this, and what business consequence follows.
Name the data and the systems, not the abstract risk.

### Likelihood
Is this reachable now? Is there evidence it has been used? What would it take?

### Remediation
The specific change, with the command or console path.
Then the durable control that prevents recurrence.

### Verification
How you confirmed the fix. A re-run of the check, and its output.
```

The three sections beginners under-write are **Impact**, **Likelihood**, and **Verification**.

| Section | Weak version | Strong version |
|---|---|---|
| **Impact** | “This is a security risk” | “Any identity with this key can read every customer export in the bucket. Those exports contain names, addresses, and order history — a personal-data breach requiring notification under the Data Privacy Act” |
| **Likelihood** | “An attacker could exploit this” | “The key is present in a public repository's CI configuration, so it is already publicly discoverable. CloudTrail shows no use from an unfamiliar address yet” |
| **Verification** | “I fixed it” | “Re-ran `get-public-access-block`; all four settings now report `true`. Screenshot attached” |

**Verification is what separates a report from an opinion.** Anyone can claim a fix. Re-running the check and pasting the output proves it.

#### Worked example: one finding, written properly

Here is a complete finding at roughly the level a junior cloud security analyst produces.

```text
## Finding 1 — Instance role credentials reachable through a public
## image-fetch endpoint

**Severity:** Critical
**Affected resource:** i-0abc123def456789, role `arn:aws:iam::123456789012:role/app-image-fetcher`
**Detection source:** Alert on `GetObject` from `198.51.100.7`; manual confirmation
through the application's fetch endpoint

### Description
The application exposes an endpoint at /api/fetch?url= that retrieves a
user-supplied URL server-side. The endpoint accepts the AWS instance
metadata address without validation, so a request for
http://169.254.169.254/latest/meta-data/iam/security-credentials/app-image-fetcher
returns the instance role's temporary credentials in the response body.

### Evidence
A request to the endpoint returned the following (values truncated):

  {
    "Code": "Success",
    "Type": "AWS-HMAC",
    "AccessKeyId": "ASIAEXAMPLE0000000000",
    "SecretAccessKey": "wJalrXUtnFEMI...",
    "Token": "IQoJb3JpZ2luX2Vj...",
    "Expiration": "2026-03-11T12:41:00Z"
  }

CloudTrail shows no use of these credentials yet. The role currently holds
s3:GetObject on the customer-exports bucket.

### Impact
An unauthenticated external party can obtain role credentials and, within
the credential's lifetime, read every object in the customer-exports
bucket. Those objects contain customer names, contact details, and order
history. That constitutes a personal-data breach with notification
obligations.

### Likelihood
High. The endpoint is reachable from the internet with no authentication
and requires no knowledge beyond the metadata address. There is no evidence
of use, which means the window to fix it without a breach is open now.

### Remediation
1. Immediate: add an allowlist of permitted hostnames to the fetch
   handler, reject non-matching values, and reject any address in the
   link-local range.
2. Immediate: enable IMDSv2 on the instance so that metadata requests
   require a session token.
3. Short term: replace the instance role with a narrowly scoped role
   limited to the specific image prefix the application needs.
4. Durable: add an egress rule blocking 169.254.169.254 from the
   application subnet, and alert on any attempt.
5. Durable: add a unit test asserting that the fetch handler rejects
   the metadata address.

### Verification
Re-ran the original request after step 1. The endpoint returned
HTTP 400 with body {"error":"host not permitted"}. Request to
http://169.254.169.254/ from the instance shell returned HTTP 401
after step 2, confirming IMDSv2 enforcement.
```

Notice what the report does *not* do. It does not speculate about who the attacker was. It does not claim the data was stolen. It states what the evidence shows, what the consequence would be, and what was changed.

**That restraint is what makes it credible.** A report that overstates is a report the reader discounts entirely.

### Part 8 — Legal and ethical boundaries for cloud work

#### Authorisation is what makes the work possible

The rule from Phase 1 applies without modification, and it applies to cloud work in a way beginners do not expect.

**You only test cloud accounts you own, or accounts you have written authorisation to test.**

The awkward part is that cloud accounts belong to organisations, and an organisation's cloud account contains other people's data. There is no version of “I was only enumerating” that survives contact with a client's production AWS account.

| What you might think | Why it is wrong in the cloud |
|---|---|
| “It is just an API call, it does not touch anything” | A `ListBuckets` call is logged as that identity's activity, and it may breach a contract |
| “The credentials were in a public repo, so they are fair game” | Finding a leaked key does not authorise its use. Report it; do not use it |
| “My company's cloud account is basically mine” | Your employer's tenant is not yours. Testing it without written approval can breach your contract and, depending on the jurisdiction, the law |
| “It is a free tier, so nothing is at risk” | The account is still a real identity with real logs, and abuse can cost the owner money |

**Where you practise legally, for free:**

| Target | What it teaches | Cost |
|---|---|---|
| Your own free-tier AWS account | IAM, CloudTrail, storage configuration | Free tier |
| Your own Microsoft Entra tenant | Users, groups, MFA, sign-in logs | Free |
| CloudGoat (Rhino Security Labs) | Deliberately vulnerable AWS scenarios | Free, open source; you deploy it in *your* account |
| flaws.cloud | A deliberately vulnerable AWS environment | Free |
| AWS and Microsoft free training sandboxes | Guided exercises in a provided environment | Free |
| Microsoft Learn modules | Concepts with sandbox exercises | Free |

That last column is the important one. **There is no reason to touch an account you do not own**, because purpose-built vulnerable cloud environments exist and are free.

#### The leaked-credential dilemma

Sooner or later, while searching for something else on GitHub, you will find what looks like a live cloud key in a public repository. This happens constantly, and it is worth deciding now how you will handle it.

| Do | Do not |
|---|---|
| Note the repository and the file, and take a screenshot if you need a record | Use the key, even to “check whether it works” |
| Report it to the repository owner, or to the provider's abuse contact | Post it publicly, or send it to a security news outlet |
| Use the provider's own notification channel where one exists — AWS has an abuse reporting address | Ask the owner for money |
| If you cannot find a contact, report it to the provider | Assume that because it is public, it is unowned |

**The distinction that matters:** finding a leaked credential is research. Using it is unauthorised access. The line is the use, not the discovery.

#### The data you must never put in a lab

Cloud labs are easiest to build with sample data, and beginners sometimes use real data because it is what they have.

| Never upload to a personal cloud lab | Why |
|---|---|
| Your employer's customer records | It is a data transfer to a personal account, which is very likely a policy breach |
| Real credentials of any kind | Even test accounts, if they authenticate to a real system |
| Colleagues' personal information | Personal data outside its original purpose |
| Production configuration exports | They usually contain secrets and internal addressing |
| Licensed software or keys | Licence breach independent of security |

Use generated data. If you need something that looks realistic, generate names from a list, or use a public sample dataset. There is no shortage.

#### What you still cannot do after this phase

Be precise about this, because overclaiming is the fastest way to lose an interview.

You can now read a CloudTrail event and tell whether it is routine or worth chasing, and you can write a finding about a misconfigured resource with evidence and a remediation. You **cannot** yet design an IAM permission boundary across an organisation and put it under change control, and you have not run a cloud incident — you have reconstructed one from an example, which is not the same thing.

| You can | You cannot yet |
|---|---|
| Read one identity's activity and explain it | Design a multi-account permission model with boundaries and guardrails |
| Write a scoped policy for one task | Migrate a running workload onto a least-privilege role without breaking it |
| Recognise the five common misconfigurations | Run an organisation-wide posture programme with exceptions and tracking |
| Reconstruct a sequence from logs you generated | Respond to a live cloud incident with a real business clock running |

**Say it that way in an interview.** “I have read CloudTrail and written findings against my own lab; I have not operated a cloud environment under change control” is a stronger answer than a vague claim of cloud experience.

### Key takeaways

- **In the cloud there is no perimeter — there is an identity and a log.** The defender's question changes from “did traffic cross the boundary?” to “which identity did this, and were they allowed to?”
- **Stolen credentials and misconfiguration dominate cloud incidents**, not software exploits. The defence is fewer permissions, shorter-lived credentials, stronger authentication, and useful logs.
- **The shared responsibility model is a work-allocation document.** Identity and logging stay yours in every service model. Patching on IaaS stays yours too, and that is the row teams forget.
- **A policy states permission, not intent.** Read every policy for the furthest reach it grants, not for the task it was written to support.
- **Wildcard actions and wildcard resources are the two largest amplifiers in cloud security.** `iam:PassRole` lets an identity hand a role to another service, so a low-privilege caller can borrow a more privileged one; `iam:Attach*` grants new permissions outright; `s3:*` on `*` is unrestricted object storage. Those three are the specific patterns to hunt.
- **Managed identities beat long-lived keys whenever they are available**, because you cannot leak a secret you never hold. A credential you can copy is a credential that will be copied.
- **The metadata service at `169.254.169.254` is a credential-dispensing endpoint**, and SSRF against a cloud application is therefore credential theft. IMDSv2 exists because of this.
- **Public storage buckets are the most reported cloud misconfiguration in the world.** Detect the configuration *change* with `PutBucketAcl` and `PutBucketPolicy`, not the resulting state a day later.
- **Cloud logs split into control plane and data plane, and attackers live in both.** Monitoring only data access misses the permission change that made it possible.
- **Six CloudTrail fields answer most questions:** `eventName`, `userIdentity.arn`, `sourceIPAddress`, `userAgent`, `requestParameters`, and `errorCode`.
- **`CreateAccessKey`, `AttachUserPolicy`, and `StopLogging` are three of the highest-value detections you can write**, because they represent persistence, escalation, and blinding.
- **When containing a cloud incident, remove the credentials the attacker created before rotating the ones they stole.** Otherwise they re-enter within the hour.
- **Cloud logs are strong on who and weak on what content moved.** That asymmetry pushes incident response toward scope estimation and data classification.
- **Set a budget alarm before you create your first resource.** The only way to lose real money in this phase is to leave something running.
- **Only test accounts you own or have written authorisation for.** Purpose-built vulnerable cloud environments such as CloudGoat and flaws.cloud exist so that you never need to test anything else.

### Practice this next

The eight tasks build in a deliberate order: establish the identity lab, then the cloud lab, then the reading skill, then the finding. Work them in sequence.

1. **Create the free Microsoft Entra tenant and do the identity work** (tasks 1 and 2). Build the user, the group, and the MFA enrolment, then read the sign-in logs until you can explain every column. This is the fastest route to cloud identity fluency because the interface is friendlier than the raw AWS API.
2. **Create the AWS free-tier account and a budget alarm in the same session** (task 3). Do not create a single resource before the alarm exists. Then create one IAM user with no permissions at all, and prove that it is denied everything.
3. **Write the three policies** (task 4): a read-only policy, a scoped write policy, and a deliberately over-permissive one. Then attack your own over-permissive policy: list every action it grants that the task did not require, and write that list down. That list is the beginning of your finding.
4. **Build the public bucket, then detect it, then fix it** (task 5). Create a bucket with sample generated data, make it public with a bucket policy, then find it with the audit loop from Part 5. Fix it, and re-run the check to capture the before-and-after evidence.
5. **Read CloudTrail until a sequence tells you a story** (task 6). Generate the activity yourself — create a user, attach a policy, create an access key — then open CloudTrail and reconstruct what happened from the log alone, without looking at what you did. Write the sequence as a timeline table.
6. **Write the detections** (task 7), at least three of them, covering logging disruption, privilege escalation, and credential creation. You do not need a SIEM for this: a saved CloudTrail filter, or a short script, is enough. What matters is that each detection names the event and says what it means.
7. **Write the IAM access review** (task 8). Export every identity in your tenant or account with its permissions and last sign-in, and produce a table with a keep, reduce, or remove recommendation and a one-line reason for each. This is the artifact that most resembles real junior cloud security work.
8. **Write the finding last**, using the template in Part 7, on the misconfiguration you created in task 5. Fill in all six sections, and do not skip Verification — re-run the check and paste the output.

Then open `portfolio/cyber/09-cloud-and-identity.md` and assemble the deliverables. **The phase is done when you can read a cloud activity log, explain who did what and whether it was expected, secure an identity with MFA and least privilege, and write a finding about a misconfigured cloud resource** — and you can hold that conversation without notes, because the artifacts are in front of you.

## Tools for This Phase

| Tool | What it does | Cost | Official link | Mini-task | Free alternative |
|---|---|---|---|---|---|
| Microsoft Entra ID | Cloud identity provider | Freemium | https://www.microsoft.com/en-us/security/business/identity-access/microsoft-entra-id | Create a free tenant and enrol a user in MFA | Google Workspace Identity free trial, or AWS IAM Identity Center |
| AWS Free Tier | Cloud lab environment | Freemium | https://aws.amazon.com/free/ | Create an account, set a budget alarm, create one IAM user | Azure free account, Google Cloud free tier |
| AWS CloudTrail | Cloud API audit logging | Free | https://aws.amazon.com/cloudtrail/ | Read the last 24 hours of events and identify one permission change | Azure Activity Log |
| Azure Activity Log | Control-plane audit logging | Free | https://learn.microsoft.com/en-us/azure/azure-monitor/essentials/activity-log | Filter for role assignment creation | AWS CloudTrail |
| IAM Policy Simulator | Test policy effects | Free | https://policysim.aws.amazon.com/ | Test an over-permissive policy against a scoped action | Manual policy review against the AWS action list |
| CloudGoat | Vulnerable AWS scenarios | Free/open-source | https://github.com/RhinoSecurityLabs/cloudgoat | Deploy one scenario in your own account | flaws.cloud |
| flaws.cloud | Vulnerable AWS training environment | Free | http://flaws.cloud/ | Complete the first three levels | CloudGoat |
| Prowler | Cloud security posture scanning | Free/open-source | https://github.com/prowler-cloud/prowler | Run a read-only scan against your own account | ScoutSuite |
| Microsoft Learn | Free cloud and identity training | Free | https://learn.microsoft.com/en-us/training/ | Complete the SC-900 identity modules | AWS Skill Builder free courses |
| AWS Skill Builder | Free AWS training | Freemium | https://skillbuilder.aws/ | Complete the IAM fundamentals course | Microsoft Learn, Google Cloud Skills Boost |
| GitGuardian | Secret scanning for repositories | Freemium | https://www.gitguardian.com/ | Scan your own portfolio repo for accidental secrets | gitleaks |
| gitleaks | Local secret scanning | Free/open-source | https://github.com/gitleaks/gitleaks | Run a scan over your lab notes repository | GitGuardian free tier |

## Free/cheap resources

- Microsoft Entra ID documentation — https://learn.microsoft.com/en-us/entra/identity/
- AWS IAM User Guide — https://docs.aws.amazon.com/IAM/latest/UserGuide/
- AWS CloudTrail User Guide — https://docs.aws.amazon.com/awscloudtrail/latest/userguide/
- AWS Well-Architected Security Pillar — https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html
- CloudGoat scenarios — https://github.com/RhinoSecurityLabs/cloudgoat
- flaws.cloud — http://flaws.cloud/
- Microsoft Learn security training — https://learn.microsoft.com/en-us/training/
- OWASP Server-Side Request Forgery — https://owasp.org/www-community/attacks/Server_Side_Request_Forgery
- AWS instance metadata service documentation — https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html
- Prowler documentation — https://docs.prowler.com/

## Hands-on practice tasks

1. Create a free Microsoft Entra ID tenant and add two test users in a group. <!-- id: cyber-09-t01 band: focused energy: normal -->
2. Enable MFA for one user and read the sign-in log entries it produces. <!-- id: cyber-09-t02 band: focused energy: normal -->
3. Create an AWS free-tier account, set a one-dollar budget alarm, and create a no-permission IAM user. <!-- id: cyber-09-t03 band: focused energy: normal -->
4. Write three IAM policies: read-only, scoped write, and deliberately over-permissive. List the excess permissions in the third. <!-- id: cyber-09-t04 band: focused energy: normal -->
5. Create an S3 bucket with sample data, make it public, detect it with a script, then fix it and re-verify. <!-- id: cyber-09-t05 band: deep energy: high -->
6. Generate cloud activity and reconstruct the sequence from CloudTrail alone as a timeline. <!-- id: cyber-09-t06 band: deep energy: high -->
7. Write three detections: logging disruption, privilege escalation, and access-key creation. <!-- id: cyber-09-t07 band: focused energy: normal -->
8. Produce an IAM access review table with keep, reduce, or remove recommendations for every identity. <!-- id: cyber-09-t08 band: focused energy: normal -->

## Deliverable / proof of work

Create `portfolio/cyber/09-cloud-and-identity.md` with:

- Entra ID tenant notes: users, groups, MFA configuration, and a sign-in log table explained
- Three IAM policies with a written analysis of what each one actually allows
- The over-permissive policy audit: every excess permission listed with a reason
- Public bucket lab: the exposure, the detection script and output, and the fix with verification
- A CloudTrail timeline table reconstructing a sequence you generated yourself
- Three detection rules with the event names they watch and what each event means
- One full cloud finding with description, evidence, impact, likelihood, remediation, and verification
- An IAM access review table with keep, reduce, or remove decisions
- A short legal and ethical boundaries note stating what you will and will not test

## Checklist

- [ ] I can explain the shared responsibility model for IaaS, PaaS, and SaaS. <!-- id: cyber-09-cloud-shared-responsibility energy: low -->
- [ ] I created a free Entra ID tenant and added test users. <!-- id: cyber-09-entra-tenant-setup energy: normal -->
- [ ] I enabled MFA and read the resulting sign-in log entries. <!-- id: cyber-09-entra-mfa-signin energy: normal -->
- [ ] I can explain conditional access as an if-then statement with signals and controls. <!-- id: cyber-09-conditional-access-concept energy: low -->
- [ ] I wrote three IAM policies and analysed what each actually allows. <!-- id: cyber-09-iam-policy-writing energy: normal -->
- [ ] I can identify over-permissive permissions in a policy and justify each removal. <!-- id: cyber-09-least-privilege-audit energy: normal -->
- [ ] I explained why managed identities are safer than long-lived access keys. <!-- id: cyber-09-managed-identity-reasoning energy: low -->
- [ ] I completed a public storage bucket lab including detection and remediation. <!-- id: cyber-09-public-bucket-lab energy: normal -->
- [ ] I read CloudTrail or Activity Log and reconstructed a sequence as a timeline. <!-- id: cyber-09-cloudtrail-timeline energy: normal -->
- [ ] I wrote three cloud detection rules naming the events they watch. <!-- id: cyber-09-cloud-detections energy: normal -->
- [ ] I can explain the metadata endpoint and why SSRF there is credential theft. <!-- id: cyber-09-metadata-ssrf-explanation energy: low -->
- [ ] I produced an IAM access review with keep, reduce, or remove decisions. <!-- id: cyber-09-iam-access-review energy: normal -->
- [ ] I wrote a cloud finding with evidence, impact, remediation, and verification. <!-- id: cyber-09-cloud-finding-writeup energy: high -->
- [ ] I set a cloud budget alarm before creating any resource. <!-- id: cyber-09-cloud-cost-guardrail energy: low -->
- [ ] I stated in writing what cloud systems I will and will not test. <!-- id: cyber-09-cloud-legal-boundaries energy: low -->

## You're ready to move on when...

You can read a cloud activity log, explain who did what and whether it was expected, secure an identity with MFA and least privilege, and write a finding about a misconfigured cloud resource.

## Free vs Paid

### What's free and enough

The Microsoft Entra ID free tenant, the AWS free tier with a budget alarm, CloudTrail and Activity Log, CloudGoat and flaws.cloud, Prowler, Microsoft Learn, and AWS Skill Builder's free courses are enough to complete this phase and to hold your own in a junior cloud security conversation. Conditional access is the one topic the free tier does not let you configure directly; Microsoft Learn sandboxes and documented reading cover the concept properly, and no purchase is required.

### What's paid and why you'd upgrade

Entra ID P1 unlocks conditional access and risk-based policies, which is what a real organisation uses to enforce MFA contextually rather than globally. Azure or AWS paid tiers unlock larger environments, longer log retention, and managed detection services. Cloud security posture management platforms such as Wiz, Orca, and Prisma Cloud add continuous multi-cloud scanning, graph-based attack-path analysis, and compliance reporting that open-source tooling does not match. A cloud certification exam buys a hiring filter rather than a skill, and the skill is what this phase produces.

### When it's worth paying

Pay only when an employer requires it or when you already hold a cloud-adjacent role and need the licence to do your job. For a learner on a $0 budget, the free tenant plus Microsoft Learn sandboxes teach conditional access well enough to discuss it credibly in an interview. Never leave a paid resource running while you study something else — set a budget alarm first, and delete resources the same day. If a cloud certification is on your list at all, treat it the way Phase 7 describes: study the free material first, and decide about the exam only after you have evidence it removes a real filter in your market.