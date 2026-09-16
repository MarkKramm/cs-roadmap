---
id: advance-04-cloud-identity-architecture
track: advance
phase: 4
order: 40
title: "Phase 4 — Cloud and Identity Architecture"
duration: "6 weeks"
duration_weeks: 6
energy_mix: [low, normal]
deliverable: "portfolio/advance/04-cloud-identity-architecture.md"
exit_criteria: "You can design a landing zone, write enforced permission-boundary and SCP guardrails as reviewed policy-as-code, federate human and workload identity without static keys, and rehearse a break-glass path that ends in a written record."
---

# Phase 4 — Cloud and Identity Architecture

## Goal of this phase

Learn to design the controls rather than operate them: the account and subscription structure that makes blast radius a decision, the guardrails that are enforced rather than merely documented, the identity model that lets humans and workloads assume the right role for the right duration, and the emergency path that is tested before anyone needs it.

## Estimated time

**6 weeks** at about 8–11 focused hours a week. Roughly 48–66 hours, and most of it is spent writing and testing policy rather than reading.

## Skills you'll gain

- Design an account and subscription hierarchy (a landing zone) and defend each boundary as a blast-radius decision.
- Write and attach service control policies and permission boundaries, and explain the difference between them.
- Turn a least-privilege aspiration into a testable policy by generating, reviewing, and shrinking a real policy document.
- Write a role trust policy that constrains who may assume a role, under what conditions, and for how long.
- Federate human identity through an identity provider and remove standing long-lived credentials.
- Give a workload — a pipeline, a container, a virtual machine — an identity with no static secret.
- Express a guardrail as policy-as-code and make it fail a pull request.
- Design, document, and rehearse a break-glass path, including the post-use review.
- Write a key policy that separates who administers a key from who uses it.
- Segment a cloud network and explain why the perimeter moved to the identity plane.
- Produce logging and evidence at organisational scale, and say where it is incomplete.
- Classify every control you own as exists, enforced, or monitored — and state the difference.

## Specific topics to learn

- Accounts, subscriptions, OUs, and management groups as boundaries rather than folders
- Landing zone: identity, security, logging, network, and workload accounts and the reasons for each
- Blast radius, fault isolation, quota isolation, and billing attribution as the four forces behind account structure
- Service control policies: inheritance, the deny-only model, and what they cannot do
- Permission boundaries: the maximum-permission envelope and the classic misunderstanding
- Identity-based policies, resource-based policies, and why a resource policy can defeat an identity policy
- Least privilege as an engineering problem: access logs, policy generation, unused-access findings, right-sizing
- Role assumption: trust policies, `sts:AssumeRole`, session duration, external IDs, source identity, and confused-deputy problems
- Role chaining and the MFA context that does not survive it
- Federation and SSO: SAML, OIDC, SCIM provisioning, and permission sets
- Workload identity: OIDC federation for pipelines, managed identities, IAM roles for service accounts
- Secrets management: secret stores versus parameter stores, rotation, and why a static key is a design failure
- Key management: customer-managed keys, key policies, rotation, and separation of key administration from key use
- Policy-as-code: Terraform plan analysis, Rego, and CI enforcement
- Guardrails: preventive, detective, and corrective controls, and where each belongs
- Break-glass and emergency access: two accounts, no standing access, alerting, and the post-use ritual
- Cloud network segmentation: VPC and VNet design, subnets, security groups, network security groups, private endpoints, and egress control
- Organisational logging: organisation trails, central log archive, immutability, and retention as an evidence deadline
- The difference between a control that exists and a control that is enforced, and how to measure it

## Lesson: A Guardrail You Cannot Bypass Is Worth Ten You Can

### Why this lesson exists

You already know how to read a cloud log and how to secure an identity at a basic level. That was the entry-level skill — the cybersecurity roadmap's cloud and identity phase is where it is taught, and if you have been in a security role for a year or two you have almost certainly done it: you have looked at a CloudTrail or Entra sign-in event, you have spotted a stale access key, you have turned on multi-factor authentication for somebody.

This phase is a different kind of work. It is the work of **deciding what the shape of the environment should be**, before anybody builds in it, and then making that decision stick when forty engineers are deploying on a Friday afternoon.

That shift is the whole point, and it is the reason a lot of capable analysts stall at exactly this career step. Reading a log is a skill you can practise alone. Designing a landing zone, writing a permission boundary that caps every role in an account, arguing for a break-glass process with an auditor in the room — that is a design and negotiation skill, and it is what distinguishes a security engineer from a security operator.

There are three ideas in this lesson that are worth more than everything else in it, and they are worth stating up front so you can watch for them.

| Idea | The one-line version |
|---|---|
| **The account is the boundary** | Isolation in cloud comes from the account or subscription, not from a naming convention |
| **A control that exists is not a control that is enforced** | A written policy is a wish; an attached, tested, alerted control is a control |
| **Identity is the new perimeter** | Network controls still matter, but the thing that actually decides who can do what is the role and its trust policy |

The last one is the reason this phase is called “Cloud and Identity Architecture” rather than two separate phases. In a modern estate, the network is a cost and latency optimisation that happens to also be a security control. The identity plane is where the security decision actually lives.

#### What the exit criterion actually demands

Read it again, because it names four separate deliverables, and each one is a portfolio artefact.

| Requirement | The skill underneath it |
|---|---|
| **Design a landing zone** | Structural judgement: what must be isolated from what, and why |
| **Write enforced permission-boundary and SCP guardrails as reviewed policy-as-code** | Engineering: policy that lives in Git, is reviewed, is tested, and is deployed by a pipeline |
| **Federate human and workload identity without static keys** | Identity architecture: no long-lived secret exists, for a person or for a machine |
| **Rehearse a break-glass path that ends in a written record** | Operational maturity: the emergency path is tested, alerted, and reviewed |

The fourth is the one candidates skip, and it is the one that separates someone who has read about cloud security from someone who has run it. Every organisation has an emergency access story. Very few have one that has been tested in the last twelve months.

#### Time to complete

**Roughly 50–65 hours over 6 weeks:**

| Work | Hours | Notes |
|---|---|---|
| Reading this lesson | 4–5 | Once, properly, with the tables open |
| Drawing the landing zone and defending it | 6–8 | The design document is the hard part, not the diagram |
| Writing and attaching SCPs and permission boundaries | 8–10 | Terraform plus a lot of reading of the documentation |
| Least-privilege policy work | 8–10 | Generating, reviewing, shrinking, and re-testing |
| Federation and workload identity | 8–10 | The highest-value technical hours in the phase |
| Policy-as-code and CI | 6–8 | Getting a guardrail to fail a plan is the moment it becomes real |
| Break-glass design and rehearsal | 4–6 | Short, and it produces the most quotable artefact |
| The portfolio write-up | 6–8 | The deliverable |

If your employer's cloud tenant is off-limits — and it should be, for practice — the whole phase is doable in a personal AWS account and a personal Entra ID tenant, both of which are free at the scale this phase needs. Part 8 covers exactly where the free tier stops and how to work around it.

#### What this phase is not

It is not a cloud certification course. It does not teach you every service. If you want breadth across AWS or Azure services, that is a different body of material.

It is not a phase where you operate an existing environment. It is a phase where you **design the constraints other people operate inside**. That is a smaller, more senior, and much more leveraged job.

And it is not a phase about writing one perfect policy. Every design in this lesson has a rejected alternative, and the alternatives are taught on purpose, because the interview question is never “what did you build” — it is “why that, and not the other thing.”

### Part 1 — The account is the boundary, and a landing zone is the design

#### Why a folder is not a boundary

The single most common structural mistake in cloud adoption is treating the account or subscription hierarchy as an organisational chart. Somebody creates an account per team, names them well, and assumes that team isolation is therefore solved.

It is not, and the reason is mechanical rather than philosophical. In AWS, almost every limit, quota, and access decision is scoped to an account. In Azure, almost every limit is scoped to a subscription. A tag is not a boundary. A naming convention is not a boundary. A resource group is not a boundary in the sense that matters here — it is a lifecycle container, and its access control is a convenience, not an isolation guarantee.

**Blast radius** is the term for the amount of the estate a single compromise, mistake, or misconfiguration can reach. A landing zone is a deliberate answer to the question “how large should blast radius be, everywhere, and why.”

Four forces push on that answer, and they pull in different directions. Getting the structure right means choosing where to compromise between them.

| Force | What it wants | What it costs |
|---|---|---|
| **Blast radius** | More accounts, smaller each | Operational overhead: more places to configure, more places to break |
| **Fault isolation** | Separate accounts for separate failure domains | Cross-account networking and IAM complexity |
| **Quota isolation** | Separate accounts for noisy workloads | Duplicated baseline configuration |
| **Billing attribution** | One account per cost centre or product | More accounts than the security team wants to manage |

A design that ignores the fourth force gets fought by finance. A design that ignores the first gets destroyed by its first incident.

#### The reference structure, and the reason for each piece

Every mature landing zone converges on roughly the same shape, because the same forces apply everywhere. The AWS version is called the AWS Security Reference Architecture and is published for free; the Azure version is the Cloud Adoption Framework landing zone. They agree more than they disagree.

| Account or subscription | Purpose | Why it is separate |
|---|---|---|
| **Management / root** | Organisation administration, SCP management, billing | It holds the keys to everything, so almost nothing else may live in it |
| **Identity** | The identity provider, directory, or SSO tenant | Compromise here is compromise everywhere, so it is isolated and heavily restricted |
| **Log archive** | Central, immutable destination for organisation-wide logs | It must survive the compromise of the accounts it collects from |
| **Security / audit** | GuardDuty, Defender, Security Hub, central detection, and the security team's own tooling | The team that investigates must not need standing access to the accounts it investigates |
| **Network / shared services** | Transit gateway, DNS, central egress, shared endpoints | Networking is shared infrastructure, and shared infrastructure is a shared failure domain |
| **Workload accounts** | One per environment, or per product, or per compliance boundary | This is where the blast-radius decision is actually made |
| **Sandbox** | Unrestricted experimentation, no data, no connectivity to production | People will experiment; the only question is whether they do it somewhere contained |

The middle row — the log archive — is the one that separates a real landing zone from a diagram. A log archive is only useful if it is **immutable** and if the accounts it collects from cannot delete what they sent. That means: no delete permission for anyone but a narrowly scoped administrative role, an object-lock or immutability window, and a separate account so that a compromised workload account cannot reach into the archive and tidy up after itself.

**The practical test for any proposed structure is this:** name the thing that would have to be compromised for two pieces of the estate to be compromised together. If the answer is “nothing, they are separate,” the boundary is real. If the answer is “one IAM role that both of them trust,” the boundary is theatre.

#### Drawing the hierarchy

Two shapes recur, and choosing between them is a genuine design decision rather than a matter of taste.

| Shape | Structure | Best when | Weakness |
|---|---|---|---|
| **Environment-first** | Production, staging, development as the top-level split, with products underneath | The organisation's main risk is a developer or test process affecting production | Compliance boundaries that cut across environments are awkward |
| **Product-first** | One OU or management group per product or business unit, with environments underneath | Teams own their whole lifecycle, and each product has different regulatory needs | Production and non-production share a parent, so an inherited guardrail must be environment-aware |

Most organisations end up with a hybrid: a small number of top-level OUs for the shared platform accounts, then a product-first split for workloads, with environment expressed as a sub-level so that guardrails can differ. The important thing is not which shape you choose. It is that **you can say what each boundary is for** without referring to the org chart.

That is the first portfolio artefact, and it is a design document rather than a diagram. A diagram with no justification is a drawing. The justification is what an interviewer reads.

#### A landing zone in Terraform, at the level this phase cares about

You do not need to build a hundred accounts. You need to build a hierarchy and attach one guardrail to it, so you can see the mechanism. This is the AWS version, and it is the shape every real deployment follows.

```hcl
terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "ap-southeast-1"
}

# The organization. feature_set = "ALL" is required before service
# control policies can be attached to anything.
resource "aws_organizations_organization" "org" {
  aws_service_access_principals = [
    "cloudtrail.amazonaws.com",
    "config.amazonaws.com",
    "guardduty.amazonaws.com",
    "sso.amazonaws.com",
  ]
  feature_set = "ALL"
}

# Top-level OUs. Each one is a different answer to "how much can go wrong
# at once, and who is allowed to be the cause".
resource "aws_organizations_organizational_unit" "security" {
  name      = "Security"
  parent_id = aws_organizations_organization.org.roots[0].id
}

resource "aws_organizations_organizational_unit" "infrastructure" {
  name      = "Infrastructure"
  parent_id = aws_organizations_organization.org.roots[0].id
}

resource "aws_organizations_organizational_unit" "workloads" {
  name      = "Workloads"
  parent_id = aws_organizations_organization.org.roots[0].id
}

resource "aws_organizations_organizational_unit" "sandbox" {
  name      = "Sandbox"
  parent_id = aws_organizations_organization.org.roots[0].id
}

# Environment split inside Workloads. Guardrails are attached here rather
# than to individual accounts, so a new account inherits them on creation.
resource "aws_organizations_organizational_unit" "workloads_prod" {
  name      = "Production"
  parent_id = aws_organizations_organizational_unit.workloads.id
}

resource "aws_organizations_organizational_unit" "workloads_nonprod" {
  name      = "NonProduction"
  parent_id = aws_organizations_organizational_unit.workloads.id
}
```

The Azure equivalent uses management groups, and the hierarchy is the same idea with different nouns.

```bash
# A four-level management group hierarchy.
az account management-group create --name "contoso" --display-name "Contoso"
az account management-group create --name "contoso-platform" --display-name "Platform" --parent "contoso"
az account management-group create --name "contoso-landing-zones" --display-name "Landing Zones" --parent "contoso"
az account management-group create --name "contoso-corp" --display-name "Corp" --parent "contoso-landing-zones"
az account management-group create --name "contoso-online" --display-name "Online" --parent "contoso-landing-zones"
az account management-group create --name "contoso-sandbox" --display-name "Sandbox" --parent "contoso"

# Assign an existing subscription to a management group. Policy and RBAC
# assigned at the management group now apply to everything below it.
az account management-group subscription add \
  --name "contoso-corp" \
  --subscription "00000000-1111-2222-3333-444444444444"
```

That last command is the one worth internalising. **An assignment at a management group is inherited by every subscription beneath it, including subscriptions that do not exist yet.** That property — inherit on creation — is what makes hierarchy a control rather than a filing system.

#### What the hierarchy does not do

It does not stop anyone. A hierarchy with nothing attached to it changes nothing about what an identity can do. Every guardrail in this phase is an attachment to a node in the hierarchy you just built, and the hierarchy only matters because it is the thing that carries the attachment.

### Part 2 — SCPs, permission boundaries, and the difference between existing and enforced

#### Service control policies: the deny-only ceiling

A **service control policy** (SCP) is an AWS Organizations policy that sets the maximum permissions available to identities in the accounts it is attached to. It is an organisation-level control, and it is important to understand precisely what it can and cannot do.

| Property | SCP behaviour |
|---|---|
| **Applies to** | Every principal in the attached accounts, including the account root user, except the management account |
| **Effect** | Sets a ceiling. An SCP never grants a permission |
| **Language** | Same IAM policy language, but only `Allow` and `Deny` matter; an `Allow` only means “not blocked here” |
| **Deny wins** | An explicit `Deny` at any level cannot be overridden by anything below it |
| **Does not apply to** | The management account, service-linked roles, and the organisation's own APIs |

Those two exclusions are the ones that catch people. **An SCP does not apply to the management account**, which is the main reason the management account should hold nothing but billing and organisation administration. And service-linked roles are exempt, so an SCP cannot be used to stop a service from doing something it needs a service-linked role for.

Here is an SCP that does three things every organisation eventually wants: stop an account leaving the organisation, protect the audit trail from being switched off, and confine the root user to the small set of tasks that genuinely require it.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyLeavingTheOrganization",
      "Effect": "Deny",
      "Action": [
        "organizations:LeaveOrganization",
        "organizations:DeleteOrganization",
        "organizations:RemoveAccountFromOrganization"
      ],
      "Resource": "*"
    },
    {
      "Sid": "ProtectTheAuditTrail",
      "Effect": "Deny",
      "Action": [
        "cloudtrail:StopLogging",
        "cloudtrail:DeleteTrail",
        "cloudtrail:UpdateTrail",
        "cloudtrail:PutEventSelectors",
        "config:DeleteConfigurationRecorder",
        "config:StopConfigurationRecorder",
        "config:DeleteDeliveryChannel",
        "config:PutConfigurationRecorder"
      ],
      "Resource": "*"
    },
    {
      "Sid": "DenyRootUserExceptForTheTasksThatRequireIt",
      "Effect": "Deny",
      "NotAction": [
        "iam:CreateServiceLinkedRole",
        "iam:DeleteServiceLinkedRole",
        "iam:GetAccountSummary",
        "iam:ListAccountAliases",
        "account:EnableRegion",
        "account:DisableRegion",
        "account:ListRegions",
        "account:GetAccountInformation",
        "aws-portal:ViewBilling",
        "aws-portal:ViewAccount",
        "aws-portal:ModifyAccount",
        "support:*",
        "health:*",
        "trustedadvisor:*",
        "ce:*",
        "cur:*",
        "s3:PutAccountPublicAccessBlock",
        "s3:GetAccountPublicAccessBlock"
      ],
      "Resource": "*",
      "Condition": {
        "StringLike": {
          "aws:PrincipalArn": "arn:aws:iam::*:root"
        }
      }
    }
  ]
}
```

Three things about that document are worth pointing at.

**The third statement uses `NotAction` with a `Condition` on the principal ARN.** That combination is the only way to write “deny everything for the root user, except this list.” You cannot write an `Allow` that rescues the root user, because `Deny` beats `Allow` — so the exception has to be built into the `Deny` itself, by excluding actions from it. That inversion is the single most confusing thing about organisation policy, and it is why these policies are read carefully by two people rather than one.

**The `Action` list in that statement is deliberately narrow.** It is not the full list AWS publishes for root-user lockdown; it is the subset that this account genuinely needs. Copying a long allow-list you do not understand is how you lock an account out of its own billing console.

**`ProtectTheAuditTrail` denies the actions rather than the resource.** `cloudtrail:StopLogging` with `Resource: "*"` denies stopping any trail in the account. Writing `Resource` as a specific trail ARN would leave the next trail unprotected, which is the failure mode this statement exists to prevent.

Attaching it is a two-command operation, and doing it in Terraform rather than by hand is the difference between a configuration and a change-controlled configuration.

```bash
aws organizations create-policy \
  --name DenyRootUserExceptAllowlisted \
  --description "Confine the root user and protect the audit trail" \
  --type SERVICE_CONTROL_POLICY \
  --content file://scp-root-lockdown.json

aws organizations attach-policy \
  --policy-id p-9klmnopqrs \
  --target-id ou-abcd-11111111
```

```hcl
resource "aws_organizations_policy" "root_lockdown" {
  name        = "DenyRootUserExceptAllowlisted"
  description = "Confine the root user and protect the audit trail"
  type        = "SERVICE_CONTROL_POLICY"

  content = file("${path.module}/policies/scp-root-lockdown.json")
}

# Attach at the root so that every current and future account inherits it.
resource "aws_organizations_policy_attachment" "root_lockdown" {
  policy_id = aws_organizations_policy.root_lockdown.id
  target_id = aws_organizations_organization.org.roots[0].id
}
```

**Attach at the root, not at each OU.** If you attach the root lockdown at each OU, the next OU somebody creates is unprotected, and nobody notices until an audit. Attaching at the root makes the default safe and makes exceptions explicit.

#### Permission boundaries, and the wrong first guess

A **permission boundary** is an IAM policy attached to a user or role that sets the maximum permissions that identity can ever have, regardless of what its identity-based policies say.

This is where almost everyone gets it wrong the first time, and the wrong first guess is worth stating plainly because it costs people weeks.

> **Wrong first guess:** “A permission boundary grants the permissions listed in it, and the role's policy grants the rest.”
>
> **What actually happens:** A permission boundary grants nothing at all. The effective permissions of an identity are the **intersection** of what its identity-based policies allow and what its permission boundary allows. If a permission is in the boundary and not in the identity policy, it is denied. If it is in the identity policy and not in the boundary, it is denied. It must be in both.

Someone who believes the wrong first guess attaches a boundary, sees their role stop working, and concludes that permission boundaries are broken. Someone who understands the intersection writes a boundary that is deliberately wider than any role beneath it, so the boundary never interferes with normal work and only ever stops the catastrophic case.

Here is a boundary built for that purpose: broad enough that a developer role can do its job, narrow enough that no developer role can ever become an administrator, leave the organisation, or touch the audit trail.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PermitTheServicesDeveloperRolesUse",
      "Effect": "Allow",
      "Action": [
        "s3:*",
        "dynamodb:*",
        "lambda:*",
        "logs:*",
        "cloudwatch:*",
        "sns:*",
        "sqs:*",
        "ec2:Describe*",
        "ecr:*",
        "ecs:*",
        "sts:GetCallerIdentity",
        "tag:GetResources"
      ],
      "Resource": "*"
    },
    {
      "Sid": "PermitReadOnlyIdentityContext",
      "Effect": "Allow",
      "Action": [
        "iam:Get*",
        "iam:List*",
        "iam:PassRole"
      ],
      "Resource": "*"
    },
    {
      "Sid": "DenyAnythingThatEscapesTheEnvelope",
      "Effect": "Deny",
      "NotAction": [
        "s3:*",
        "dynamodb:*",
        "lambda:*",
        "logs:*",
        "cloudwatch:*",
        "sns:*",
        "sqs:*",
        "ec2:Describe*",
        "ecr:*",
        "ecs:*",
        "sts:GetCallerIdentity",
        "tag:GetResources",
        "iam:Get*",
        "iam:List*",
        "iam:PassRole"
      ],
      "Resource": "*"
    },
    {
      "Sid": "DenyIdentityEscalationPathsEvenWhenListedAbove",
      "Effect": "Deny",
      "Action": [
        "iam:CreateUser",
        "iam:CreateAccessKey",
        "iam:CreateLoginProfile",
        "iam:UpdateLoginProfile",
        "iam:AttachUserPolicy",
        "iam:PutUserPolicy",
        "iam:AddUserToGroup",
        "organizations:*",
        "account:*",
        "cloudtrail:*",
        "config:*"
      ],
      "Resource": "*"
    }
  ]
}
```

Two design choices in that document are the ones to copy.

**The first and third statements are mirror images.** The third denies everything not named in the first, which means adding a service to the first statement is the only way to widen the envelope. That makes the envelope reviewable in one place, and it makes a widening change visible in a diff — which is exactly what you want from a control.

**The fourth statement denies even the things the first allows.** `iam:PassRole` is in the first statement because roles that create compute need it. `iam:CreateUser` and `iam:CreateAccessKey` are not, and the fourth statement makes that explicit rather than relying on a reader to notice an absence. Explicit denies that contradict a broad allow are how you make an intent legible to the next reviewer.

Attaching it is a single command, and the effect is immediate.

```bash
aws iam create-policy \
  --policy-name OrgDeveloperBoundary \
  --description "Maximum permissions any developer role may hold" \
  --policy-document file://boundary-developer.json

aws iam put-role-permissions-boundary \
  --role-name DeveloperRole \
  --permissions-boundary arn:aws:iam::444455556666:policy/OrgDeveloperBoundary
```

```hcl
data "aws_iam_policy_document" "developer_boundary" {
  # A managed policy document loaded from JSON keeps the boundary in one
  # reviewable file rather than scattered across HCL blocks.
  statement {
    sid       = "PermitTheServicesDeveloperRolesUse"
    effect    = "Allow"
    actions   = ["s3:*", "dynamodb:*", "lambda:*", "logs:*", "cloudwatch:*"]
    resources = ["*"]
  }

  statement {
    sid       = "DenyAnythingThatEscapesTheEnvelope"
    effect    = "Deny"
    not_actions = [
      "s3:*", "dynamodb:*", "lambda:*", "logs:*", "cloudwatch:*",
      "sts:GetCallerIdentity",
    ]
    resources = ["*"]
  }
}

resource "aws_iam_policy" "developer_boundary" {
  name   = "OrgDeveloperBoundary"
  policy = data.aws_iam_policy_document.developer_boundary.json
}

resource "aws_iam_role" "developer" {
  name                 = "DeveloperRole"
  assume_role_policy   = data.aws_iam_policy_document.developer_assume.json
  permissions_boundary = aws_iam_policy.developer_boundary.arn
  max_session_duration = 3600
}
```

#### SCP versus permission boundary, side by side

These two get conflated constantly, and confusing them produces designs that protect nothing.

| | Service control policy | Permission boundary |
|---|---|---|
| **Scope** | An organisation, OU, or account | A single IAM user or role |
| **Who can change it** | Only the organisation's management account | Anyone with `iam:PutRolePermissionsBoundary` on the role |
| **Applies to** | Every principal in the account | Only the identity it is attached to |
| **Protects against** | An account-level mistake, an insider with account admin, a compromised account administrator | A single role being over-privileged, accidentally or deliberately |
| **Does not protect against** | Anything in the management account | An administrator removing the boundary |
| **Managed by** | The platform or security team, centrally | The team that owns the role, within a central standard |

The last row of the SCP column is the honest limitation and it is worth saying out loud in a design review: **the management account is outside the SCP's reach.** That is why the management account holds nothing, why access to it is a break-glass process rather than a role, and why an SCP is a control over the organisation rather than over the organisation's owner.

#### The distinction the phase is named for

A control that **exists** is written down somewhere. A control that is **enforced** cannot be bypassed by the people it applies to. A control that is **monitored** is not enforced, but you will find out when it is violated.

| Control | Exists | Enforced | Monitored |
|---|---|---|---|
| “Developers must not create IAM users” | A wiki page says so | SCP denies `iam:CreateUser` in the workload OU | — |
| “All S3 buckets must block public access” | A standard says so | An SCP or bucket policy denies it, plus a Config rule | Config rule with an alert |
| “Break-glass use must be approved” | A process document | Break-glass role requires MFA and is alerted on | CloudWatch or Sentinel alert to the on-call |
| “Root user must not have access keys” | An onboarding checklist | SCP denies `iam:CreateAccessKey` for root | Config rule with automatic remediation |

The third column is the one that matters, and the transition from column one to column two is most of what a cloud security engineer is paid to do. Everything else in this lesson — policy-as-code, break-glass rehearsal, alerting on role changes — is machinery for making that transition repeatable.

### Part 3 — Least privilege as an engineering problem

#### Why “least privilege” is a slogan until you measure it

Least privilege is the most repeated and least implemented principle in security, and the reason is not laziness. It is that **nobody knows what the least privilege is** without measuring, and measuring requires infrastructure that most teams never build.

The slogan version says: give people and workloads only the permissions they need. The engineering version says: observe what permissions are actually used over a representative period, generate a policy from that observation, review it for the things observation cannot see, ship it, and re-measure.

That is a four-step loop, and every step of it is a task you can do in a personal account this week.

| Step | What you do | The free tooling that does it |
|---|---|---|
| **1. Observe** | Turn on the audit log and let it run for at least 30 days | CloudTrail management events, Azure Activity Log |
| **2. Generate** | Produce a candidate policy from the observed actions | IAM Access Analyzer policy generation, or your own query over the log |
| **3. Review** | Add what observation missed: break paths, rare operations, future needs | A human, and this is the step that cannot be automated |
| **4. Ship and re-measure** | Deploy, then check for `AccessDenied` and unused grants | CloudTrail, Access Analyzer unused-access findings, Access Advisor |

The third step is where the judgement lives, and it is the step that a purely automated approach gets wrong. **Observation tells you what was used; it cannot tell you what must remain available.** A backup restore role that has not been used in ninety days is not unused — it is insurance. A role that handles a year-end process has not been used for eleven months and is not unused either.

That is the sentence that separates a policy generated by a tool from a policy a human will accept, and it is the sentence to use in an interview when asked how you would approach least privilege.

#### Generating a policy from the log

Suppose a role has been running for a month and you want to know what it actually did. In AWS, Access Analyzer can generate a policy from CloudTrail activity.

```bash
# Generate a candidate policy from 90 days of CloudTrail activity for a role.
aws accessanalyzer start-policy-generation \
  --policy-generation-details '{
    "principalArn": "arn:aws:iam::444455556666:role/PaymentsApiTaskRole",
    "cloudTrailDetails": {
      "trailArn": "arn:aws:cloudtrail:ap-southeast-1:444455556666:trail/org-trail",
      "accessRole": "arn:aws:iam::444455556666:role/AccessAnalyzerServiceRole",
      "startTime": "2025-12-14T00:00:00Z",
      "endTime": "2026-03-14T00:00:00Z"
    }
  }'

# Poll for the job, then retrieve the generated policy.
aws accessanalyzer get-generated-policy --job-id <job-id>
```

If you do not have Access Analyzer available — and on a personal account you may not — the same result comes from a query over the trail, because the log is the ground truth either way.

```bash
# What did this role actually do in the last 90 days? Distinct actions only.
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=Username,AttributeValue=PaymentsApiTaskRole \
  --start-time 2025-12-14T00:00:00Z \
  --end-time 2026-03-14T00:00:00Z \
  --query 'Events[].CloudTrailEvent' \
  --output text \
| jq -r 'fromjson | "\(.eventSource):\(.eventName)"' \
| sort -u
```

The output of that pipeline is a list like `s3:GetObject`, `s3:PutObject`, `dynamodb:Query`, `kms:Decrypt`, `logs:CreateLogStream`. That list is the *observed* set, and it is the input to step three, not the answer.

The generated policy from that list will look something like this, and the interesting question is what is *not* in it.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ObservedS3Access",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::payments-attachments-prod/*"
    },
    {
      "Sid": "ObservedDynamoDBAccess",
      "Effect": "Allow",
      "Action": [
        "dynamodb:Query",
        "dynamodb:GetItem",
        "dynamodb:PutItem"
      ],
      "Resource": "arn:aws:dynamodb:ap-southeast-1:444455556666:table/payments-ledger"
    },
    {
      "Sid": "ObservedKeyUsage",
      "Effect": "Allow",
      "Action": "kms:Decrypt",
      "Resource": "arn:aws:kms:ap-southeast-1:444455556666:key/6f1a2b3c-4d5e-6f70-8192-a3b4c5d6e7f8"
    },
    {
      "Sid": "ObservedLogging",
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:ap-southeast-1:444455556666:log-group:/aws/lambda/payments-api:*"
    }
  ]
}
```

Four improvements turn that into a policy a reviewer will accept.

| Change | Why |
|---|---|
| Drop `s3:PutObject` if the workload only ever wrote during a migration | Observation includes the migration; the steady state is narrower |
| Scope the KMS grant to the specific key and add `kms:ViaService` | Prevents the key being used from anywhere except S3, DynamoDB, or Lambda as intended |
| Split log-stream creation from log writing | The two are different risk levels, and the API needs only one of them at start-up |
| Add a `Condition` on `aws:PrincipalArn` or a source VPC endpoint | Makes the policy useless if the role's credentials are lifted and used from elsewhere |

That fourth row is the one that changes the character of the policy. It is the point at which least privilege stops being about which actions are allowed and starts being about where and how they are allowed — and it is the point where an identity control becomes an architectural one.

```json
{
  "Sid": "ObservedKeyUsage",
  "Effect": "Allow",
  "Action": "kms:Decrypt",
  "Resource": "arn:aws:kms:ap-southeast-1:444455556666:key/6f1a2b3c-4d5e-6f70-8192-a3b4c5d6e7f8",
  "Condition": {
    "StringEquals": {
      "kms:ViaService": "s3.ap-southeast-1.amazonaws.com"
    }
  }
}
```

#### The common failure: the temporary administrator

There is a pattern that appears in almost every cloud estate, and it is worth naming because you will be the person asked to fix it.

> A team needs something done urgently. A role is given `AdministratorAccess`. A ticket is raised to remove it later. The ticket is never closed. Two years later, seventeen roles hold `AdministratorAccess`, and nobody can say which of them still needs it.

This is not a permissions problem. It is a process problem that manifests as a permissions problem, and it has three fixes that work together.

| Fix | What it does | Why the others are not enough |
|---|---|---|
| **A permission boundary on every human role** | Caps the worst case regardless of the attached policy | Does not tell you who has the broad policy |
| **A standing query over attached policies** | Finds every principal holding a broad managed policy | Does not stop the next one being granted |
| **A time-bound elevation process** | Makes broad access a session, not a state | Requires the first two to be safe to use |

The third is the architecturally correct answer, and it is what a modern estate does. Nobody holds administrator. A person requests elevation, gets a role for two hours, uses it, and the role expires. The permission boundary is what makes that safe, because even the elevated role cannot exceed the envelope — so elevation changes the *ceiling temporarily reachable within a fixed envelope*, not the envelope itself.

That distinction is the design idea of this part, and it is worth writing down: **elevation should change duration, not scope.**

### Part 4 — Role assumption, trust policy, and federation

#### The trust policy is the security control

Every IAM role has two policies. The identity-based policy says what the role can do. The **trust policy** — properly, the role trust policy or assume-role policy — says who is allowed to become the role. Almost every cloud identity incident you will read about involves a trust policy that was too permissive, and almost none of them involve an identity policy that was too permissive.

That asymmetry is why this part exists, and it is why a trust policy deserves more of your review attention than the permissions attached to the role.

A trust policy that lets a partner account assume a role, constrained by an external ID and nothing else, looks like this.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowPartnerAccountToAssumeWithExternalId",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::111122223333:root"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "sts:ExternalId": "c1f4b0a7-2d8e-4a3f-9b21-6a0e5d7c4f88"
        }
      }
    }
  ]
}
```

The external ID is not a secret and it is not authentication. It exists to solve the **confused deputy problem**: a situation where a trusted service is tricked into using its own authority on behalf of the wrong party. Without an external ID, any customer of that partner could point the partner at your role ARN. With it, the partner must supply the value only your account knows.

The same role assumed by a human through federation is a different trust policy, and it is where the useful constraints live.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "BreakGlassAssumeFromTheIdentityProviderOnly",
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::444455556666:saml-provider/ContosoEntraID"
      },
      "Action": "sts:AssumeRoleWithSAML",
      "Condition": {
        "StringEquals": {
          "SAML:aud": "https://signin.aws.amazon.com/saml"
        }
      }
    }
  ]
}
```

**That policy looks empty of constraints, and it is not.** The constraint is upstream, in the identity provider: only members of a specific group are assigned this role in the SAML application. The trust policy says “the identity provider may assert this role”; the identity provider says “only these people may assert it.” Splitting the control that way is normal and correct, and it is why reviewing a trust policy means reviewing the identity provider's assignment at the same time.

#### Session duration and the MFA context that does not survive a chain

Two settings on a role do more for real security than most people expect.

**`max_session_duration`** is the maximum validity of a role session, from one hour to twelve. Almost every organisation sets it to eight hours for convenience and never revisits it. For an administrative or break-glass role, one hour is the right answer, because the window in which a stolen session token is useful should be short.

**`aws:MultiFactorAuthPresent`** is a condition key that is true when the credentials used to make the request were obtained with multi-factor authentication. Putting it in a trust policy is a standard hardening step, and it has a failure mode that has confused every engineer who has met it once.

> **Common failure:** A trust policy requires `aws:MultiFactorAuthPresent: true`. It works when a human signs in and assumes the role directly. Then someone builds a pipeline that assumes a role, then assumes this role from that session — **role chaining** — and it fails, even though the human authenticated with MFA.
>
> The reason is that the MFA context is not propagated through a chained role assumption. The second `AssumeRole` call carries no MFA evidence, because the credentials it used were themselves a session, not a freshly authenticated identity.

The fixes are three, and only one of them is usually the right answer.

| Fix | Effect | When it is right |
|---|---|---|
| Remove the MFA condition from the chained role | The chain works, and the second role loses its MFA guarantee | When the first role's trust policy already requires MFA, and the chain is short |
| Add `sts:SetSourceIdentity` and require `sts:SourceIdentity` | The originating identity is carried into CloudTrail, so the chain is auditable | Almost always — this is the correct hardening |
| Give the pipeline its own workload identity instead of chaining roles | Removes the chain entirely | When the pipeline is the actual principal, which it usually is |

The third answer is the one this phase is aiming at, and it is the subject of the next part.

For a role that is assumed directly and where MFA is meaningful, the condition is short and worth writing every time.

```json
{
  "Sid": "BreakGlassAssumeRequiresFreshMFAAndCarriesSourceIdentity",
  "Effect": "Allow",
  "Principal": {
    "Federated": "arn:aws:iam::444455556666:saml-provider/ContosoEntraID"
  },
  "Action": "sts:AssumeRoleWithSAML",
  "Condition": {
    "StringEquals": {
      "SAML:aud": "https://signin.aws.amazon.com/saml"
    },
    "Bool": {
      "aws:MultiFactorAuthPresent": "true"
    },
    "NumericLessThan": {
      "aws:MultiFactorAuthAge": "900"
    }
  }
}
```

`aws:MultiFactorAuthAge` is measured in seconds, so `900` means the MFA had to happen within the last fifteen minutes. That is the setting that turns MFA from “you have it” into “you used it, recently, for this.”

#### Working with roles from the command line

When you are debugging a trust policy, being able to assume the role by hand and inspect what you get is a skill worth having, because it separates “the policy is wrong” from “the caller is wrong” in about thirty seconds.

```bash
# Assume the role and capture the temporary credentials.
aws sts assume-role \
  --role-arn arn:aws:iam::222233334444:role/OrgAuditReadOnly \
  --role-session-name audit-2026-03-14 \
  --external-id c1f4b0a7-2d8e-4a3f-9b21-6a0e5d7c4f88 \
  --duration-seconds 3600

# Use them for a single call without exporting anything.
AWS_ACCESS_KEY_ID=$(aws configure get role.access_key) \
AWS_SECRET_ACCESS_KEY=$(aws configure get role.secret_key) \
AWS_SESSION_TOKEN=$(aws configure get role.token) \
aws sts get-caller-identity

# Who am I, and through which path did I get here?
aws sts get-caller-identity --query 'Arn' --output text
```

The last command is the one to run first whenever a permission is failing, because a surprising number of “the policy is broken” problems are “you are not who you think you are.”

In Azure, the equivalent is a role assignment plus a federated credential, and the useful diagnostic is the same idea.

```bash
# Who am I signed in as, and against which subscription?
az account show --query '{user:user.name, tenant:tenantId, subscription:name}' --output json

# What role assignments exist at a scope, with the principal behind each one?
az role assignment list \
  --scope "/subscriptions/00000000-1111-2222-3333-444444444444" \
  --include-inherited \
  --query '[].{principal:principalName, type:principalType, role:roleDefinitionName, scope:scope}' \
  --output table
```

#### Federation, and what SCIM is for

**Federation** means the identity provider — Entra ID, Okta, Google Workspace — authenticates the human, and the cloud provider accepts an assertion rather than a password. The human never has a cloud credential. **SSO** is the same mechanism with a friendlier name, applied across multiple applications.

The mechanics differ by protocol but the shape does not.

| Protocol | Where you meet it | The assertion |
|---|---|---|
| **SAML 2.0** | Enterprise SSO into the cloud console, older and very widely deployed | A signed XML document, usually delivered through the browser |
| **OIDC** | Modern SSO, pipelines, and workload federation | A signed JSON Web Token |
| **SCIM** | Provisioning and deprovisioning | Not an authentication protocol — a user-management API |

SCIM is the one people under-invest in. **Authentication without deprovisioning is a half-built control.** If a person is removed from the directory but their access persists because nothing propagates the removal, then your federation has made login convenient without making revocation reliable. SCIM is the mechanism that closes that gap, and it is worth checking whether it is enabled in any environment you inherit.

### Part 5 — Workload identity: giving a machine an identity instead of a secret

#### Why a static key is a design failure

Every long-lived credential is a liability with a maintenance schedule attached. It can be copied, it can be committed, it can be emailed, it can be forgotten, and it must be rotated by somebody who will not do it. A static cloud access key is the single most common cause of cloud compromise that is not a misconfigured storage bucket.

**Workload identity** is the general answer. Instead of a secret, the workload proves who it is to the platform using a short-lived token that the platform can verify, and receives temporary credentials in return.

The mechanism is the same everywhere: **OIDC federation between a workload's own identity system and the cloud provider's token exchange.** GitHub Actions issues a signed token describing the repository and the ref. Kubernetes issues a service account token. Azure issues a managed identity token. The cloud provider verifies the signature against a registered issuer and, if the subject matches what the trust policy requires, hands back temporary credentials.

The security property that matters: **there is no secret to steal that is valid anywhere else, and the credentials expire in minutes.**

#### AWS: an OIDC trust policy for a pipeline

A pipeline that runs in GitHub Actions and needs AWS access should have no repository secret containing an AWS key. It should have this instead.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowGitHubActionsFromOneRepoAndBranchOnly",
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::444455556666:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          "token.actions.githubusercontent.com:sub": "repo:acme/payments-api:ref:refs/heads/main"
        }
      }
    }
  ]
}
```

The `sub` condition is the entire security content of that policy, and it is worth reading carefully.

| If `sub` is | Then |
|---|---|
| `repo:acme/payments-api:ref:refs/heads/main` | Only workflows on `main` in that one repository can assume the role |
| `repo:acme/payments-api:*` | **Any** branch, tag, or pull request in that repository can assume the role — including a pull request from a fork, if the workflow is configured to allow it |
| `repo:acme/*` | Any repository in the organisation can assume the role |
| omitted entirely | Any GitHub workflow in the world can assume the role |

The third row and the fourth row are the configurations that appear in real breach reports. The fix is always the same: pin the `sub` to a specific repository **and** a specific ref or environment.

```hcl
# Register GitHub as an OIDC provider for the account, once.
resource "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"

  client_id_list = ["sts.amazonaws.com"]

  # Thumbprints are no longer required for this provider, but the field is
  # still accepted; leaving it empty is valid for well-known providers.
  thumbprint_list = []
}

# The role the pipeline assumes. No access key exists anywhere.
resource "aws_iam_role" "github_deploy" {
  name = "GitHubActionsDeployRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid    = "AllowGitHubActionsFromOneRepoAndBranchOnly"
      Effect = "Allow"
      Principal = {
        Federated = aws_iam_openid_connect_provider.github.arn
      }
      Action = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = {
          "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          "token.actions.githubusercontent.com:sub" = "repo:acme/payments-api:ref:refs/heads/main"
        }
      }
    }]
  })

  max_session_duration = 3600
}
```

#### Azure: a managed identity with a federated credential

The Azure equivalent has two forms. A **managed identity** is an identity the platform creates and manages for a resource, with no credential you ever see. A **federated identity credential** on a managed identity lets an external system — GitHub, Kubernetes, Terraform Cloud — assume it.

```bash
# Create a user-assigned managed identity for the workload.
az identity create \
  --name "id-payments-api" \
  --resource-group "rg-payments-prod"

# Let GitHub Actions assume it, pinned to one repository and one branch.
az identity federated-credential create \
  --name "github-main" \
  --identity-name "id-payments-api" \
  --resource-group "rg-payments-prod" \
  --issuer "https://token.actions.githubusercontent.com" \
  --subject "repo:acme/payments-api:ref:refs/heads/main" \
  --audiences "api://AzureADTokenExchange"

# Grant the identity the smallest role it needs, at the smallest scope.
az role assignment create \
  --assignee-object-id "$(az identity show --name id-payments-api \
      --resource-group rg-payments-prod --query principalId --output tsv)" \
  --assignee-principal-type ServicePrincipal \
  --role "Key Vault Secrets User" \
  --scope "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/rg-payments-prod/providers/Microsoft.KeyVault/vaults/kv-payments-prod"
```

The last command is the one that pairs with the previous part. Note the role: `Key Vault Secrets User`, not `Key Vault Administrator`. The identity can read secrets; it cannot change access policy, cannot delete the vault, and cannot grant itself more. That is the separation the next part formalises.

#### Kubernetes, because it is where this gets skipped

A pod that needs to read from object storage has three options, and only one of them is correct.

| Option | What it does | Verdict |
|---|---|---|
| A secret containing a static cloud key | Mounted into the pod as an environment variable or file | The key is now in etcd, in any backup, and in anyone's `kubectl describe` output |
| The node's instance role | Every pod on the node inherits the node's cloud permissions | Any pod that can schedule on the node can reach the cloud |
| **A service account with a workload identity** | The pod exchanges its projected service account token for cloud credentials | The correct answer: per-pod identity, no static secret, short-lived |

In AWS this is IAM Roles for Service Accounts; in Azure it is Workload Identity; in GKE it is Workload Identity Federation. The name differs and the mechanism is identical: a projected Kubernetes service account token is exchanged for a cloud credential, scoped to a specific Kubernetes namespace and service account.

The trust policy condition that makes it safe is the Kubernetes equivalent of the GitHub `sub` condition.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowOneNamespaceAndServiceAccountOnly",
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::444455556666:oidc-provider/oidc.eks.ap-southeast-1.amazonaws.com/id/EXAMPLED539D4633E53DE1B71EXAMPLE"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "oidc.eks.ap-southeast-1.amazonaws.com/id/EXAMPLED539D4633E53DE1B71EXAMPLE:aud": "sts.amazonaws.com",
          "oidc.eks.ap-southeast-1.amazonaws.com/id/EXAMPLED539D4633E53DE1B71EXAMPLE:sub": "system:serviceaccount:payments:payments-api"
        }
      }
    }
  ]
}
```

**If the `sub` condition is replaced with a wildcard, every service account in the cluster can assume the role.** That is the cluster-level version of the `repo:acme/*` mistake, and it is exactly as common.

### Part 6 — Secrets, keys, and the separation of duties

#### A secret store is not a solution on its own

A managed secret store — AWS Secrets Manager, Azure Key Vault, HashiCorp Vault — solves three problems: it removes secrets from source control, it centralises rotation, and it gives you an access log for secret reads. It does not solve the problem of a workload authenticating to the secret store, which is why workload identity and secrets management are the same conversation.

| Question | The wrong answer | The right answer |
|---|---|---|
| How does the workload get the secret? | A key stored in a config file | A workload identity that reads the secret at start-up |
| How does the secret rotate? | Manually, quarterly, in a ticket | Automatically, with the workload re-reading it |
| Who can read the secret? | Anyone with the vault's contributor role | A named identity, at a named scope, with an access log |
| How do you know it was read? | You do not | The audit log, alerted on unexpected readers |

The last row is the one that turns a secret store into a security control rather than a filing cabinet.

```bash
# Create a vault with RBAC authorisation and soft delete, so an accidental
# deletion is recoverable and every read is attributable to an identity.
az keyvault create \
  --name "kv-payments-prod" \
  --resource-group "rg-payments-prod" \
  --location "southeastasia" \
  --enable-rbac-authorization true \
  --enable-purge-protection true \
  --retention-days 90

# Grant one identity read access to secrets only, not to keys or certificates.
az role assignment create \
  --assignee-object-id "$(az identity show --name id-payments-api \
      --resource-group rg-payments-prod --query principalId --output tsv)" \
  --assignee-principal-type ServicePrincipal \
  --role "Key Vault Secrets User" \
  --scope "/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/rg-payments-prod/providers/Microsoft.KeyVault/vaults/kv-payments-prod"
```

#### Key policies, and why administration and use are different jobs

Encryption in cloud is not a binary. The interesting question is **who holds the key**, and the answer determines who can read the data when the access controls fail.

A **customer-managed key** is one your organisation controls. The control is expressed in a **key policy**, which in AWS is a resource-based policy that governs the key itself. The design principle that matters is separating the people who administer the key from the people who use it: the administrator can change the key policy, and the user can encrypt and decrypt, and neither can do the other's job.

```json
{
  "Version": "2012-10-17",
  "Id": "key-policy-payments",
  "Statement": [
    {
      "Sid": "EnableIAMPoliciesToDelegateKeyAccess",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::444455556666:root"
      },
      "Action": "kms:*",
      "Resource": "*"
    },
    {
      "Sid": "KeyAdministratorsMayManageButNotUse",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::444455556666:role/KeyAdministratorRole"
      },
      "Action": [
        "kms:Create*",
        "kms:Describe*",
        "kms:Enable*",
        "kms:List*",
        "kms:Put*",
        "kms:Update*",
        "kms:Revoke*",
        "kms:Disable*",
        "kms:Get*",
        "kms:TagResource",
        "kms:UntagResource",
        "kms:ScheduleKeyDeletion",
        "kms:CancelKeyDeletion"
      ],
      "Resource": "*"
    },
    {
      "Sid": "PaymentsRoleMayUseButNotManage",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::444455556666:role/PaymentsApiTaskRole"
      },
      "Action": [
        "kms:Decrypt",
        "kms:DescribeKey",
        "kms:GenerateDataKey"
      ],
      "Resource": "*"
    },
    {
      "Sid": "DenyKeyDeletionAndDeletionOfImportedMaterial",
      "Effect": "Deny",
      "Principal": "*",
      "Action": [
        "kms:DeleteImportedKeyMaterial"
      ],
      "Resource": "*"
    }
  ]
}
```

Four notes on that document, because each one is a design decision a reviewer will ask about.

**The first statement delegates to IAM.** Without an account-root principal statement, IAM policies cannot grant access to the key at all, because a KMS key policy is the gate. That statement is boilerplate and it is load-bearing; removing it because it “looks permissive” breaks the key.

**The second and third statements are deliberately disjoint.** `KeyAdministratorRole` has `kms:Create*` and `kms:ScheduleKeyDeletion` but not `kms:Decrypt`. `PaymentsApiTaskRole` has `kms:Decrypt` but cannot change the key policy. An administrator who cannot read the data, and a reader who cannot change who else can read it.

**The third statement uses `Resource: "*"` inside a key policy, and that is correct.** A key policy is scoped to one key, so `*` means “this key.” That is not the same as `*` in an identity policy, and reading a key policy with identity-policy instincts is a common source of confusion.

**`kms:ScheduleKeyDeletion` is granted to administrators and denied to nobody.** That looks like a gap and it is a deliberate one: deleting a key is sometimes necessary, and the control that prevents an accident is the mandatory waiting period AWS enforces, plus the alert that should fire when it happens.

#### Where the free tier stops

This is worth stating plainly, because the budget rule for this repository is that everything is doable for $0, and cloud key management is one of the places where the honest answer is “almost.”

| Thing | Free tier reality | The $0 workaround |
|---|---|---|
| Customer-managed KMS keys | Charged per key per month, plus per request | Design the key policy and the rotation plan on paper; test with the default AWS-managed keys, which are free |
| Azure Key Vault | Charged per operation, with a small free monthly allowance | Stay within the allowance; a personal tenant at practice volume usually does |
| Secrets Manager | Charged per secret per month | Use SSM Parameter Store's standard tier, which is free, for the design exercise |
| CloudTrail organisation trail | Management events free for one trail per account | Use management events only; data events are charged |
| AWS Config | Charged per configuration item recorded | Use CloudTrail plus a scheduled query instead of a Config rule where you can |

The pattern in that table generalises: **the design work is free, and the telemetry at scale is not.** Design the control, prove the mechanism on the free tier, and write down honestly which parts you proved and which parts you designed without running. An interviewer will respect the distinction far more than a claim you cannot support.

### Part 7 — Policy as code: making a guardrail fail a pull request

#### Why a written standard is not a guardrail

A security standard that lives in a wiki is read once, at onboarding, and never again. A guardrail expressed as code is enforced at the moment of change, by a machine, without anybody having to remember it.

**Policy as code** means the rule is written in a machine-readable form, stored in version control alongside the infrastructure it governs, tested in CI, and applied automatically. There are three places it can run, and mature organisations use all three.

| Where it runs | What it catches | Example |
|---|---|---|
| **At plan time, in CI** | A change that violates a rule, before it is applied anywhere | A Terraform plan that creates an IAM role with no permission boundary |
| **At apply time, by the platform** | A change that bypasses the pipeline entirely | An SCP that denies `iam:CreateUser` |
| **Continuously, after the fact** | Drift, and resources that predate the rule | A Config rule or Azure Policy that flags a non-compliant resource |

The first is the one this part teaches, because it is the one you can build entirely on your own with free tooling.

#### OPA and Rego, at the level you actually need

**Open Policy Agent** (OPA) is a general-purpose policy engine, and **Rego** is its policy language. You do not need to learn all of Rego. You need to be able to read a Terraform plan as JSON and write rules that reject the handful of shapes you care about.

The workflow is four commands.

```bash
# 1. Produce a plan.
terraform plan -out=tfplan.binary

# 2. Convert it to JSON, which is the format policy engines consume.
terraform show -json tfplan.binary > tfplan.json

# 3. Evaluate the policies against the plan.
conftest test --policy policy/ tfplan.json

# 4. Or run OPA directly if you prefer not to use the conftest wrapper.
opa eval --data policy/ --input tfplan.json "data.terraform.aws.deny"
```

The policies themselves are short, and each one encodes a decision somebody already made.

```rego
package terraform.aws

# Every IAM role must declare a permissions boundary. A role with no
# boundary has no ceiling, and the ceiling is the whole point.
deny[msg] {
  resource := input.resource_changes[_]
  resource.type == "aws_iam_role"
  not resource.change.after.permissions_boundary
  msg := sprintf("aws_iam_role %q has no permissions_boundary", [resource.address])
}

# Inline IAM policies cannot be reviewed, reused, or versioned on their
# own, so they are banned in favour of managed policies.
deny[msg] {
  resource := input.resource_changes[_]
  resource.type == "aws_iam_role_policy"
  msg := sprintf("inline policy %q: use aws_iam_policy and aws_iam_role_policy_attachment", [resource.address])
}

# A bucket that does not block public ACLs is a bucket that can be made
# public by a single later change.
deny[msg] {
  resource := input.resource_changes[_]
  resource.type == "aws_s3_bucket_public_access_block"
  not resource.change.after.block_public_acls
  msg := sprintf("bucket %q does not block public ACLs", [resource.address])
}

# Role trust policies must not trust an entire organisation or account
# without a further condition.
deny[msg] {
  resource := input.resource_changes[_]
  resource.type == "aws_iam_role"
  policy := json.unmarshal(resource.change.after.assume_role_policy)
  statement := policy.Statement[_]
  statement.Principal.AWS == "arn:aws:iam::111122223333:root"
  not statement.Condition
  msg := sprintf("role %q trusts a foreign account root with no condition", [resource.address])
}

# Break-glass roles must be tagged, so that alerting can find them.
deny[msg] {
  resource := input.resource_changes[_]
  resource.type == "aws_iam_role"
  contains(resource.change.after.name, "BreakGlass")
  not resource.change.after.tags.breakglass
  msg := sprintf("break-glass role %q is missing the breakglass tag", [resource.address])
}
```

Two details in that Rego are worth understanding, because they are the two things people get wrong when they first write policy.

**`not resource.change.after.permissions_boundary` is the correct test for absence**, not `== null`. In Rego, comparing a missing field to null is undefined, and an undefined body does not make the rule fire — so the check silently passes when the attribute is simply not present, which is the exact case you are trying to catch. This is the single most common bug in hand-written Rego.

**`json.unmarshal` is how you reach inside a JSON string attribute.** The trust policy arrives in the plan as a string, not as a nested object, so the policy document has to be parsed before its statements can be inspected.

#### The same guardrail in Azure Policy

Azure Policy is a first-class platform feature rather than a CI tool, which means it enforces at apply time in addition to whatever your pipeline does. A policy definition has an `if` that describes a resource shape and a `then` that describes the effect.

```json
{
  "if": {
    "allOf": [
      {
        "field": "type",
        "equals": "Microsoft.Network/networkInterfaces"
      },
      {
        "field": "Microsoft.Network/networkInterfaces/ipConfigurations[*].publicIPAddress.id",
        "exists": "true"
      }
    ]
  },
  "then": {
    "effect": "deny"
  }
}
```

```json
{
  "if": {
    "allOf": [
      {
        "field": "type",
        "equals": "Microsoft.Storage/storageAccounts"
      },
      {
        "field": "Microsoft.Storage/storageAccounts/allowBlobPublicAccess",
        "notEquals": false
      }
    ]
  },
  "then": {
    "effect": "audit"
  }
}
```

**The choice between `deny` and `audit` is the choice between a preventive and a detective control**, and it is never a purely technical decision. `deny` is stronger and it will break somebody's deployment at the worst possible moment. `audit` changes nothing about what is possible and produces a list you have to work through.

The professional answer is to deploy new policies in `audit` mode — Azure calls this `DoNotEnforce` — watch the compliance report, remediate what it finds, and then flip to `deny`. Doing it the other way round produces an incident on the day of rollout.

```bash
# A policy definition that encodes the rule.
az policy definition create \
  --name "deny-public-ip-on-nics" \
  --display-name "Deny public IP addresses on network interfaces" \
  --rules @policy-rule-deny-public-ip.json \
  --mode All

# Assign it at a management group in audit mode first. Nothing breaks.
az policy assignment create \
  --name "audit-public-ip" \
  --policy "deny-public-ip-on-nics" \
  --scope "/providers/Microsoft.Management/managementGroups/contoso-corp" \
  --enforcement-mode DoNotEnforce

# Once the compliance report is clean, flip it to enforced.
az policy assignment update \
  --name "audit-public-ip" \
  --scope "/providers/Microsoft.Management/managementGroups/contoso-corp" \
  --enforcement-mode Default
```

That three-command sequence — define, audit, enforce — is a pattern worth carrying into every guardrail you ever ship, in any platform.

#### The CI step, which is where it becomes real

Policy that is not run in CI is a policy that will be skipped. The workflow is short.

```yaml
name: policy

on:
  pull_request:
    paths:
      - "infra/**"
      - "policy/**"

permissions:
  contents: read

jobs:
  guardrails:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: "1.6.6"

      - name: Terraform plan
        working-directory: infra
        run: |
          terraform init -input=false
          terraform plan -out=tfplan.binary -input=false
          terraform show -json tfplan.binary > tfplan.json

      - name: Install conftest
        run: |
          curl -sSL -o conftest.tar.gz \
            https://github.com/open-policy-agent/conftest/releases/latest/download/conftest_Linux_x86_64.tar.gz
          tar -xzf conftest.tar.gz
          sudo install conftest /usr/local/bin/conftest

      - name: Evaluate guardrails
        run: conftest test --policy policy/ infra/tfplan.json
```

The `paths:` filter matters more than it looks. A policy check that runs on every pull request, including documentation changes, is a policy check that gets disabled because it is slow and noisy. Scoping it to changes that can actually violate a guardrail is what keeps it switched on.

Note also that this workflow uses GitHub's OIDC token implicitly — `permissions: contents: read` and no AWS credentials stored — which is the same design as Part 5. A pipeline that checks policy should not itself be holding a static key.

### Part 8 — Break-glass, network, and evidence at organisational scale

#### Break-glass is a design, not an emergency

**Break-glass** access is the path used when normal access is broken: the identity provider is down, the SSO role is misconfigured, the automation that grants access has failed. It exists because the alternative is that a team cannot respond to an outage, and the first person to notice builds an unmanaged workaround.

A break-glass design has six components, and a design missing any of them is a design that will fail an audit or a real incident.

| Component | What it means | The failure when it is missing |
|---|---|---|
| **Two independent accounts, no standing access** | Two or more highly privileged identities, credentials split and stored separately | One person holds the only key, and there is no second path |
| **Credentials held offline, physically** | A sealed envelope in a safe, or a hardware token in a locked cabinet | The credential is in a shared password manager the outage also took down |
| **Alerting on any use, to a channel nobody can silence** | An alert to a monitored channel and, ideally, to an external address | The use is discovered during the next audit, months later |
| **A documented, short procedure** | Under one page: how to break the glass, what to do, what to write down | The person doing it improvises, and the audit trail is a mess |
| **A post-use ritual** | Rotate the credential, review the activity, close the ticket, record the reason | The credential is reused, and the next use is unremarkable |
| **A rehearsal at least annually** | Actually use the path in a test, and time it | Nobody discovers it does not work until the outage |

The second and fifth rows are the ones organisations get wrong, and they are related. If the credential is stored in a form that is easy to use, it is also easy to use casually. If it is stored in a form that is genuinely offline, then the first time anyone uses it they will discover that the envelope was resealed wrong, the password expired, or the phone number in the procedure belongs to somebody who left.

**That is why the rehearsal exists, and it is why the rehearsal is the portfolio artefact for this part.** A rehearsal produces a record: the date, the person, the time from decision to access, what broke, and what the credential rotation afterwards involved. That record is worth more in an interview than any diagram, because it proves you have actually done the thing rather than described it.

For the AWS side, the break-glass role is a normal role whose trust policy is narrow and whose use is alerted on.

```hcl
resource "aws_iam_role" "break_glass" {
  name = "BreakGlassAdminRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid    = "BreakGlassAssumeFromTheIdentityProviderOnly"
      Effect = "Allow"
      Principal = {
        Federated = "arn:aws:iam::444455556666:saml-provider/ContosoEntraID"
      }
      Action = "sts:AssumeRoleWithSAML"
      Condition = {
        StringEquals = {
          "SAML:aud" = "https://signin.aws.amazon.com/saml"
        }
        Bool = {
          "aws:MultiFactorAuthPresent" = "true"
        }
        NumericLessThan = {
          "aws:MultiFactorAuthAge" = "900"
        }
      }
    }]
  })

  # One hour. Break-glass is a session, not a state.
  max_session_duration = 3600

  tags = {
    breakglass = "true"
    owner      = "security-platform"
  }
}
```

The tag is not decoration. It is what lets the alerting query find every break-glass role without anybody maintaining a list, and it is what the Rego rule in Part 7 checks for.

#### Catching the use, in KQL

An alert that nobody can silence is an alert with a query behind it. In Microsoft Sentinel or Log Analytics, the Entra sign-in logs hold the evidence.

```kusto
// Any use of a break-glass account. Every row needs a ticket.
SigninLogs
| where TimeGenerated > ago(90d)
| where UserPrincipalName in (
    "breakglass-01@contoso.onmicrosoft.com",
    "breakglass-02@contoso.onmicrosoft.com")
| project TimeGenerated, UserPrincipalName, IPAddress, AppDisplayName,
          ResultType, ResultDescription, ConditionalAccessStatus
| sort by TimeGenerated desc
```

```kusto
// Successful sign-ins from outside the expected country, excluding the
// corporate egress range. A short list is a good sign; a long one is not.
SigninLogs
| where TimeGenerated > ago(7d)
| where ResultType == 0
| where LocationDetails.countryOrRegion != "PH"
| where IPAddress !in ("203.0.113.10", "203.0.113.11")
| project TimeGenerated, UserPrincipalName, AppDisplayName, IPAddress,
          LocationDetails.countryOrRegion, ConditionalAccessStatus, RiskLevelDuringSignIn
| sort by TimeGenerated desc
```

```kusto
// Privileged role changes, including changes made outside the managed
// elevation process. The third operation name is the interesting one.
AuditLogs
| where TimeGenerated > ago(30d)
| where OperationName in (
    "Add member to role",
    "Add eligible member to role",
    "Add member to role outside of PIM")
| extend Target = tostring(TargetResources[0].userPrincipalName)
| extend Actor  = tostring(InitiatedBy.user.userPrincipalName)
| project TimeGenerated, OperationName, Actor, Target, Result
| sort by TimeGenerated desc
```

The third query is the one to build first in any Entra environment, because **a privileged role change made outside the elevation process is either a mistake or an attack, and both need to be found within the hour rather than the quarter.**

On the AWS side, the equivalent is a query over the organisation trail.

```bash
# Every AssumeRole into any break-glass role in the last 90 days.
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=EventName,AttributeValue=AssumeRole \
  --start-time 2025-12-14T00:00:00Z \
  --query 'Events[].CloudTrailEvent' \
  --output text \
| jq -r 'fromjson
    | select(.requestParameters.roleArn | test("BreakGlass"))
    | [.eventTime, .userIdentity.arn, .requestParameters.roleArn, .sourceIPAddress]
    | @tsv'
```

#### Network segmentation, and where the perimeter actually is

Cloud network design is a large subject and this phase covers the part that matters to identity architecture: **why the network is a defence-in-depth layer rather than the primary control.**

A cloud network is not a perimeter in the traditional sense. There is no outside edge to defend, because every resource with a public address is reachable from everywhere by definition. What the network gives you is three things, and each one is worth having.

| What the network gives you | How it is expressed |
|---|---|
| **Reduced reachability** | Private subnets, no public IPs, and private endpoints instead of internet egress |
| **Egress control, which is the one people skip** | A NAT gateway with a route table that only permits known destinations, or a firewall that inspects outbound traffic |
| **A logging boundary** | VPC flow logs, NSG flow logs, and DNS query logs, which are the network evidence you will need in an incident |

The second row is the one that changes outcomes in an incident. Nearly every cloud intrusion ends with data leaving, and the egress path is where it can be seen and stopped. An environment with unrestricted outbound access has no control there, and no amount of identity hardening substitutes for it.

The third row is the one that changes your investigation. A flow log showing a host connecting to an unfamiliar address at an unusual hour is often the first signal of a compromise, and it is only available if flow logging was on before the incident rather than after.

The identity-plane equivalent of segmentation is **scoping every role to a resource rather than a service**, which is the same idea applied to permissions rather than packets.

| Network control | Its identity-plane twin |
|---|---|
| Private subnet with no route to the internet | A role whose policy is scoped to one resource ARN |
| Security group allowing one port from one source | A trust policy pinned to one repository and one branch |
| Egress firewall permitting a destination list | A `kms:ViaService` condition |
| VPC endpoint policy | A resource-based policy that refuses anything the identity policy missed |

#### Evidence at organisational scale

The last technical piece of this phase is the one that makes everything else provable: **logging designed as evidence, at the scale of the whole organisation.**

An organisation trail or a central log workspace has four properties that matter, and the fourth is the one that is usually missed.

| Property | Why it matters |
|---|---|
| **Central** | Logs in the account that was compromised are logs the attacker can edit |
| **Immutable** | Object lock or a write-only destination means an attacker cannot tidy up |
| **Complete for management events** | Every account, every region, including regions you do not use, because an attacker will use them |
| **Retained for a stated period** | The retention window is your investigation deadline, and it must be a decision rather than a default |

The fourth property is a decision that has to be made before an incident and defended afterwards. A ninety-day retention is a cost decision and a real one. What matters is that when an incident happens on day ninety-one, someone has already written down that the evidence would be gone and the business accepted that risk. That sentence in a report is the difference between an accepted risk and a surprise.

**Regions you do not use is the detail worth internalising.** An attacker with credentials will attempt to create resources in a region the organisation does not monitor, because the guardrails and the alerts are attached to the regions people use. An SCP that denies every action outside an approved region list — of which the `DenyOutsideRegionAndBreakGlass` pattern in Part 2 is one shape — removes that option entirely, and it costs nothing.

### Part 9 — The worked design decision: a permission boundary and break-glass path for an administrator role

#### The problem, stated properly

This part works one design decision all the way through, from requirement to rejected alternatives, because that is the thing an interviewer asks about and the thing a design document has to contain.

**The requirement.** A platform team of five engineers needs to administer production cloud infrastructure: create and modify networks, manage compute, manage storage, and respond to incidents at three in the morning. They need this capability continuously, not on request, because they are on call.

**The constraint.** The organisation's auditor has observed that a role with `AdministratorAccess` cannot be constrained, cannot be reviewed meaningfully, and cannot be justified. Whatever is built must have a stated ceiling, must produce evidence of use, and must not depend on anyone remembering to revoke anything.

**The starting position.** One role, `PlatformAdmin`, with `AdministratorAccess` attached, assumed by five engineers through SSO with no conditions on the trust policy, and no permission boundary.

That starting position is where most organisations actually are, and it is worth naming why it is bad rather than simply asserting it.

| Property of the starting position | Why it is a problem |
|---|---|
| `AdministratorAccess` attached | Every other control in the account can be removed by this role, including the logging |
| No permission boundary | There is no ceiling, so a compromised session is a compromised account |
| No conditions on the trust policy | Anyone who can authenticate to the identity provider as any user assigned that role can become it |
| No session duration limit set | The default applies, and sessions are long |
| No alerting | The role's use is invisible until an audit looks |

#### Step 1 — State the ceiling before the permissions

The design begins with the ceiling, because the ceiling is the part that has to be defensible to an auditor and stable over time. Everything else changes: the services the team manages will change, the specific policies will change, the people will change. The ceiling should not.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PermitPlatformOperationsAcrossApprovedServices",
      "Effect": "Allow",
      "Action": [
        "ec2:*",
        "ecs:*",
        "eks:*",
        "ecr:*",
        "elasticloadbalancing:*",
        "autoscaling:*",
        "cloudwatch:*",
        "logs:*",
        "sns:*",
        "sqs:*",
        "s3:*",
        "dynamodb:*",
        "rds:*",
        "route53:*",
        "tag:*",
        "resource-groups:*"
      ],
      "Resource": "*"
    },
    {
      "Sid": "PermitTheMinimumIdentitySurfacePlatformWorkNeeds",
      "Effect": "Allow",
      "Action": [
        "iam:Get*",
        "iam:List*",
        "iam:PassRole",
        "iam:TagRole",
        "iam:UntagRole",
        "sts:GetCallerIdentity",
        "sts:AssumeRole"
      ],
      "Resource": "*"
    },
    {
      "Sid": "DenyEverythingNotExplicitlyPermittedAbove",
      "Effect": "Deny",
      "NotAction": [
        "ec2:*",
        "ecs:*",
        "eks:*",
        "ecr:*",
        "elasticloadbalancing:*",
        "autoscaling:*",
        "cloudwatch:*",
        "logs:*",
        "sns:*",
        "sqs:*",
        "s3:*",
        "dynamodb:*",
        "rds:*",
        "route53:*",
        "tag:*",
        "resource-groups:*",
        "iam:Get*",
        "iam:List*",
        "iam:PassRole",
        "iam:TagRole",
        "iam:UntagRole",
        "sts:GetCallerIdentity",
        "sts:AssumeRole"
      ],
      "Resource": "*"
    },
    {
      "Sid": "DenyTheEscalationAndAuditPathsEvenThoughServicesArePermitted",
      "Effect": "Deny",
      "Action": [
        "iam:CreateUser",
        "iam:CreateAccessKey",
        "iam:CreateLoginProfile",
        "iam:UpdateLoginProfile",
        "iam:DeleteLoginProfile",
        "iam:AttachUserPolicy",
        "iam:PutUserPolicy",
        "iam:AddUserToGroup",
        "iam:CreatePolicyVersion",
        "iam:SetDefaultPolicyVersion",
        "iam:DeleteRolePermissionsBoundary",
        "iam:PutRolePermissionsBoundary",
        "iam:UpdateAssumeRolePolicy",
        "organizations:*",
        "account:*",
        "cloudtrail:StopLogging",
        "cloudtrail:DeleteTrail",
        "cloudtrail:UpdateTrail",
        "config:StopConfigurationRecorder",
        "config:DeleteConfigurationRecorder",
        "config:DeleteDeliveryChannel"
      ],
      "Resource": "*"
    }
  ]
}
```

**The fourth statement is the heart of the design, and it deserves an explanation rather than a reading.** The first statement grants `ec2:*` and `s3:*`. Those wildcards are necessary because a platform team genuinely needs broad access to those services, and writing an enumerated policy for every EC2 API would be a maintenance burden with no security benefit — the services' own APIs already enforce their internal limits.

What the wildcards do *not* include is the ability to change the identity plane. The fourth statement denies, explicitly, every action by which this role could give itself more power: creating users, creating access keys, editing trust policies, removing the permission boundary, editing the audit trail. Those denials sit *on top of* the broad grants, and because `Deny` beats `Allow`, they hold.

That is the design idea, and it is worth writing down as a sentence you can say out loud:

> **The role is broad within its service surface and powerless over its own identity surface.**

#### Step 2 — Attach the boundary to the role

The ceiling only means something if it is attached and if it applies to the role that has the broad policy.

```hcl
resource "aws_iam_policy" "platform_boundary" {
  name        = "OrgPlatformAdminBoundary"
  description = "Maximum permissions the platform administration role may hold"
  policy      = file("${path.module}/policies/boundary-platform-admin.json")
}

resource "aws_iam_role" "platform_admin" {
  name = "PlatformAdmin"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid    = "PlatformAdminsOnlyFromTheIdentityProvider"
      Effect = "Allow"
      Principal = {
        Federated = "arn:aws:iam::444455556666:saml-provider/ContosoEntraID"
      }
      Action = "sts:AssumeRoleWithSAML"
      Condition = {
        StringEquals = {
          "SAML:aud" = "https://signin.aws.amazon.com/saml"
        }
        Bool = {
          "aws:MultiFactorAuthPresent" = "true"
        }
        NumericLessThan = {
          "aws:MultiFactorAuthAge" = "3600"
        }
      }
    }]
  })

  # Eight hours, because the team is on call and a shorter session would
  # simply mean more re-authentication during an incident.
  max_session_duration = 28800

  # The ceiling. Without this line the identity policy above is unbounded.
  permissions_boundary = aws_iam_policy.platform_boundary.arn
}

resource "aws_iam_role_policy_attachment" "platform_admin_ops" {
  role       = aws_iam_role.platform_admin.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}
```

**That last resource is the design decision that will surprise a reader, and it is deliberate.** The role still has `AdministratorAccess` attached. It does not matter, because the permission boundary caps it. The effective permissions are the intersection, so the team has broad platform access and cannot touch the identity plane.

Leaving `AdministratorAccess` attached is not laziness. It is a choice with a real benefit: **when the boundary is wrong, the failure is visible immediately, because a legitimate task stops working.** A tightly enumerated identity policy instead of `AdministratorAccess` would produce the same effective permissions and would be much harder to reason about, because a permission failing could then be caused by the identity policy *or* the boundary. One variable instead of two is worth a lot during an incident.

#### Step 3 — The break-glass path, and why it is a separate thing

The platform admin role is the everyday path. It is not break-glass, and conflating the two is a mistake worth naming.

| | Platform admin role | Break-glass |
|---|---|---|
| **Who has it** | Five named engineers, continuously | Nobody, by default |
| **How it is obtained** | SSO, on demand | A sealed credential, retrieved physically |
| **Session length** | Eight hours | One hour |
| **Ceiling** | The platform boundary | Full administrative, with the identity plane included |
| **Alerting** | Standard privileged-role monitoring | An alert to a channel nobody can silence, plus the security lead directly |
| **Post-use** | Nothing unusual | Rotation, review, written record, ticket |

The break-glass role exists for the case where the platform role cannot be used: the identity provider is unavailable, the boundary is wrong, or the boundary itself must be changed. It is deliberately not bounded by the platform boundary, because a boundary that cannot be bypassed is a boundary you cannot fix when you get it wrong.

```hcl
resource "aws_iam_role" "break_glass" {
  name = "BreakGlassAdminRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid    = "BreakGlassAssumeRequiresFreshMFA"
      Effect = "Allow"
      Principal = {
        Federated = "arn:aws:iam::444455556666:saml-provider/ContosoEntraID"
      }
      Action = "sts:AssumeRoleWithSAML"
      Condition = {
        StringEquals = {
          "SAML:aud" = "https://signin.aws.amazon.com/saml"
        }
        Bool = {
          "aws:MultiFactorAuthPresent" = "true"
        }
        NumericLessThan = {
          "aws:MultiFactorAuthAge" = "900"
        }
      }
    }]
  })

  max_session_duration = 3600

  tags = {
    breakglass = "true"
    owner      = "security-platform"
  }
}

resource "aws_iam_role_policy_attachment" "break_glass_admin" {
  role       = aws_iam_role.break_glass.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}
```

**Note what is missing: a permission boundary.** That is the design choice, and it is the one an auditor will push on. The justification is that a break-glass role whose ceiling is the same as the everyday role has no purpose — it would be a second name for the same thing. The controls that make it safe are the ones around it rather than inside it: one hour, fresh MFA, alerting, two accounts, offline credentials, and a post-use ritual.

If the auditor is not satisfied by that, the correct response is not to add a boundary. It is to add a **control that detects and responds** — an automatic session revocation, or a lambda that disables the role after use until it is re-enabled by the security lead. That is a real design, and it is a stronger answer than a boundary that would defeat the role's purpose.

#### Step 4 — The rejected alternatives, written down

This is the section that turns the design into a document, and it is the section most candidates omit. A design without rejected alternatives is a preference. A design with them is a decision.

**Alternative 1 — Enumerate every action in the identity policy instead of using `AdministratorAccess` plus a boundary.**

Rejected because it moves the ceiling into the identity policy, where it is changed by the team that owns the role, and because it makes every failure ambiguous. A boundary is a separate artefact with a separate owner and a separate review. The enumerated policy would also need updating every time AWS adds an API the team needs, which makes it a source of outages rather than a control.

**Alternative 2 — No standing admin; elevation on request, approved by a manager, valid for two hours.**

This is the architecturally strongest option and it was rejected for a specific and honest reason: the team is on call, and an approval workflow at three in the morning costs more availability than the risk it removes. That is not a security argument, it is a business argument, and it belongs in the design document. The compromise reached was the eight-hour session with fresh MFA and alerting on out-of-hours assumption.

Had the team not been on call, this alternative would have won, and the document says so. That sentence is what makes the document credible.

**Alternative 3 — A separate AWS account per engineer, with the platform admin role in each.**

Rejected as the worst of both worlds. It multiplies the number of accounts holding administrative access, makes the audit surface larger rather than smaller, and produces no isolation benefit because all the roles administer the same resources.

**Alternative 4 — Keep `AdministratorAccess` with no boundary, and rely on CloudTrail and review.**

Rejected because review is a detective control with a lag measured in weeks. The window between an over-privileged action and its discovery would be long enough for the action to be irreversible. This is the alternative most organisations are actually running, and naming it as rejected rather than ignoring it is what makes the document honest.

#### Step 5 — Proving the ceiling works

A boundary that has never been tested is a boundary whose effect is assumed. The test is three commands and it takes four minutes.

```bash
# 1. As the platform admin role, confirm the broad access still works.
aws ec2 describe-instances --region ap-southeast-1 --max-items 1 >/dev/null && echo "ec2: allowed as expected"

# 2. As the platform admin role, attempt the thing the boundary denies.
aws iam create-access-key --user-name some-existing-user
# Expected: AccessDenied. If it succeeds, the boundary is not attached to this role.

# 3. Confirm which role you are actually using, because a surprising
#    number of "the boundary is broken" reports are "I am not that role".
aws sts get-caller-identity --query 'Arn' --output text
```

**Write the result of the second command into the design document, with the date.** That record — “on 14 March 2026, `iam:CreateAccessKey` was denied for the `PlatformAdmin` role” — is the evidence that the control is enforced rather than intended, and it is the single most useful line in the whole artefact.

#### Step 6 — The post-use ritual for break-glass

The break-glass path ends with a written record, and the record is short enough that it will actually be completed.

```text
BREAK-GLASS USE RECORD

Date and time of use      2026-03-14 02:41 UTC
Used by                   Your Name, Platform Engineering
Credential used           Sealed envelope BG-02, safe in Room 2
Reason                    SSO assertion failing for PlatformAdmin role;
                          production API returning 503 during a customer
                          incident. No alternative path available.
Authorised by             Security Lead, by phone, 02:39 UTC
Time to access            12 minutes from decision to working session
Session ended             03:22 UTC, 41 minutes
Actions performed         Inspected the SAML application assignment;
                          corrected a group mapping that had been changed
                          at 01:50 UTC; verified PlatformAdmin assumption
                          succeeded; confirmed API recovered at 03:15 UTC.

Credential rotated        Yes, 03:40 UTC. New envelope sealed and logged.
Activity reviewed         Yes, 04:10 UTC. CloudTrail shows no action other
                          than those listed above.
Follow-up ticket          SEC-2026-0314-07 — SAML group mapping change was
                          not covered by change control. Owner: IAM team.
                          Due: 2026-03-28.
```

Four lines in that record are the ones to make sure exist in any version of it.

**“No alternative path available”** is the justification. Break-glass used because it was easier than fixing the SSO group is a process failure, and the record is where that becomes visible.

**“Time to access: 12 minutes”** is the measurement. Without it, nobody knows whether the path works. With it, the organisation knows that a real outage can be answered in twelve minutes using this path, which is a fact worth having.

**“Credential rotated”** is the non-negotiable step. A break-glass credential that is not rotated after use has become a shared password.

**“Follow-up ticket”** is what turns the incident into an improvement. In this example, the root cause was a change to a SAML group mapping that bypassed change control — which is a finding about a different control entirely, and exactly the kind of finding a break-glass review exists to produce.

#### The common failure, stated as a warning

The failure mode this design is built to avoid is worth naming explicitly, because it is the one that happens when a control exists but is not enforced.

> A break-glass process is written. Two credentials are created. They are stored in the team's shared password manager, because that is where the team keeps everything and it is convenient. Nobody sets up an alert, because the CloudTrail trail is already on and “we can look if we need to.” The process document says the credentials must be rotated after use.
>
> Eighteen months later, a routine access review finds that one of the two accounts was used eleven times, that the last rotation was fourteen months ago, and that nobody can say who used it or why, because the shared password manager does not record which individual read the entry.

Every component of that story is a control that **exists**. None of them is enforced. The fix is not a better document — it is moving the credential out of the shared store, alerting on the account in a channel that cannot be muted, and requiring the rotation to be confirmed in a ticket before the incident is closed.

That is the difference this phase is named for, and it is the sentence to end on: **the question to ask about every control you inherit is not “is it documented,” but “what would have to fail for this to be bypassed, and would I find out.”**

### Key takeaways

- **The account or subscription is the boundary, not the folder.** Blast radius is decided by where you put the isolation, and a naming convention decides nothing.
- **A landing zone is a design document, not a diagram.** Name what each boundary is for and what would have to be compromised for two parts of the estate to fall together.
- **A service control policy sets a ceiling and grants nothing.** Attach it at the root so that future accounts inherit it, and remember it does not reach the management account.
- **A permission boundary is an intersection, not a grant.** The effective permissions are what the identity policy allows *and* what the boundary allows; a permission in only one of them is denied.
- **Attach the boundary and leave the broad policy alone.** One variable instead of two makes a failure diagnosable in minutes rather than hours.
- **The trust policy is the security control.** Identity policies get the review attention; trust policies cause the incidents.
- **The MFA context does not survive role chaining.** `aws:MultiFactorAuthPresent` is false on the second assumption, which is why workload identity beats a chain.
- **Pin the subject claim.** `repo:acme/*` and an omitted `sub` condition are the two configurations that appear in real breach reports.
- **A static credential is a design failure.** A workload identity is short-lived, scoped, and has nothing worth stealing.
- **Observation tells you what was used, not what must remain available.** The backup restore role that has not run in ninety days is insurance, not waste.
- **Elevation should change duration, not scope.** Broad access for two hours is safer than narrow access that nobody maintains.
- **Separate key administration from key use.** An administrator who cannot decrypt and a reader who cannot change the key policy.
- **Ship guardrails in audit mode first, then flip to deny.** A policy that breaks a deployment on rollout day gets deleted.
- **Use `not field` in Rego, not `field == null`.** A missing field makes the comparison undefined and the rule silently passes.
- **Break-glass is a design with six components**, and the rehearsal is what proves all six work. A path discovered to be broken during an outage is not a path.
- **Egress control and flow logs are the two network controls that change incident outcomes**, and both are commonly skipped.
- **Retention is a decision, not a default.** When evidence is gone, you need to be able to show that the business accepted that.
- **Ask whether a control is enforced, not whether it is documented.** “What would have to fail for this to be bypassed, and would I find out” is the question that finds the real gaps.

### Practice this next

The eleven tasks build one portfolio artefact: a design document containing a landing zone, an enforced guardrail set, an identity model with no static keys, and a rehearsed break-glass path. Do them in order, because each one supplies a section of the document.

1. **Draw the landing zone and justify every boundary** (task 1). Not a diagram — a table with one row per account or subscription and a column stating what would have to be compromised for two of them to fall together.
2. **Build a two-account hierarchy and attach one deny SCP** (task 2). Personal accounts are free. The point is to see that a new account inherits the guardrail without anybody configuring it.
3. **Write a permission boundary and prove it caps an over-permissive role** (task 3). Attach `AdministratorAccess`, attach the boundary, and try the denied action. Record the `AccessDenied` and the date.
4. **Generate a least-privilege policy from real activity and then shrink it** (task 4). The generated policy is the input, not the answer. Write down what you removed and why.
5. **Write a trust policy that requires fresh MFA, then break it with a role chain** (task 5). Experiencing the MFA-context failure once is worth more than reading about it three times.
6. **Federate a workload with no static credential** (task 6). A pipeline, a container, or a virtual machine. Delete the access key afterwards and confirm the workload still works.
7. **Make a guardrail fail a plan** (task 7). A Rego rule, a Terraform plan, and a CI step. The moment the check goes red on a pull request is the moment policy-as-code becomes real to you.
8. **Design the break-glass path and rehearse it** (task 8). Actually retrieve the credential, use it, rotate it, and write the record. Measure the time from decision to access.
9. **Write the detection queries** (task 9). KQL for the Entra side, a CloudTrail query for the AWS side, covering break-glass use, privileged role changes, and trust-policy edits.
10. **Build the control inventory and mark each control exists, enforced, or monitored** (task 10). This is the table that shows an interviewer you understand the difference the phase is named for.
11. **Write the rejected alternatives** (task 11). One page, for the design decision in Part 9 or one of your own. Four alternatives, each with the reason it lost.

Then open `portfolio/advance/04-cloud-identity-architecture.md` and assemble the deliverables. **The phase is done when you can design a landing zone, write enforced guardrails as reviewed policy-as-code, federate both human and workload identity without a static key, and rehearse a break-glass path that ends in a written record.**

## Tools for This Phase

| Tool | What it does | Cost | Official link | Mini-task | Free alternative |
|---|---|---|---|---|---|
| AWS Organizations | Account hierarchy, OUs, and service control policies | Free, built-in | https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html | Create an OU and attach a deny SCP to the root | Azure management groups, which carry Azure Policy instead |
| AWS IAM Access Analyzer | Finds externally shared resources, generates least-privilege policies from CloudTrail, reports unused access | Freemium | https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html | Generate a policy from 90 days of activity for one role | A `jq` pipeline over CloudTrail `lookup-events` output |
| Terraform | Declarative definition of hierarchy, policies, roles, and guardrail attachments | Free/open-source | https://developer.hashicorp.com/terraform | Encode one OU, one SCP, and one role with a permission boundary | OpenTofu, a fork of the same tool under a different licence |
| Open Policy Agent | General-purpose policy engine with the Rego language | Free/open-source | https://www.openpolicyagent.org/ | Write a rule that rejects an IAM role with no permission boundary | Conftest, which wraps the same engine for a single-file check |
| Checkov | Static analysis of Terraform, CloudFormation, and Kubernetes manifests | Free/open-source | https://www.checkov.io/ | Scan a Terraform directory and fix one high-severity finding | Trivy, which scans IaC alongside containers and dependencies |
| Azure Policy | Platform-enforced guardrails at management-group scope, with audit and deny effects | Free, built-in | https://learn.microsoft.com/en-us/azure/governance/policy/overview | Define a deny policy, assign it in `DoNotEnforce`, then enforce it | AWS service control policies, which set the same kind of ceiling |
| Microsoft Entra ID | Identity provider, Conditional Access, and the sign-in and audit logs used for detection | Freemium | https://learn.microsoft.com/en-us/entra/identity/ | Build one Conditional Access policy that requires MFA for a privileged role | Keycloak, self-hosted, with SAML or OIDC federation to the cloud |
| AWS IAM Identity Center | Central SSO, permission sets, and account assignment | Free, built-in | https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html | Create a permission set and assign it to one group in one account | Keycloak or Entra ID federating directly to each account by SAML |
| AWS CloudTrail | Management-event audit log for every account, the evidence base for every query in this phase | Free, built-in | https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html | Create an organisation trail delivering to a log archive account | Azure Activity Log, exported to a Log Analytics workspace |
| HashiCorp Vault | Secrets management, dynamic credentials, and short-lived secret issuance | Paid | https://developer.hashicorp.com/vault | Run the dev server and read a secret with a short-lived token | AWS SSM Parameter Store standard tier, or SOPS with age keys in Git |

## Free/cheap resources

- AWS Organizations user guide — https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html
- Service control policies reference — https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html
- IAM permission boundaries — https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html
- IAM policy evaluation logic — https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html
- IAM Access Analyzer user guide — https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html
- AWS Security Reference Architecture — https://docs.aws.amazon.com/prescriptive-guidance/latest/security-reference-architecture/welcome.html
- AWS Well-Architected Framework, Security Pillar — https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html
- AWS IAM best practices — https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html
- AWS Prescriptive Guidance, landing zone design — https://docs.aws.amazon.com/prescriptive-guidance/latest/landing-zones/welcome.html
- Azure Cloud Adoption Framework, landing zones — https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/
- Azure Policy documentation — https://learn.microsoft.com/en-us/azure/governance/policy/overview
- Azure built-in policy definitions — https://learn.microsoft.com/en-us/azure/governance/policy/samples/built-in-policies
- Microsoft Entra documentation — https://learn.microsoft.com/en-us/entra/identity/
- Microsoft Entra Privileged Identity Management — https://learn.microsoft.com/en-us/entra/id-governance/privileged-identity-management/pim-configure
- Microsoft Entra audit and sign-in log schema — https://learn.microsoft.com/en-us/entra/identity/monitoring-health/reference-audit-and-sign-in-logs-schema
- Open Policy Agent documentation — https://www.openpolicyagent.org/docs/latest/
- Rego style guide — https://docs.styra.com/opa/rego-style-guide
- Terraform AWS provider documentation — https://registry.terraform.io/providers/hashicorp/aws/latest/docs
- NIST SP 800-207, Zero Trust Architecture — https://csrc.nist.gov/pubs/sp/800/207/final
- CIS Benchmarks — https://www.cisecurity.org/cis-benchmarks
- Cloud Security Alliance Cloud Controls Matrix — https://cloudsecurityalliance.org/research/cloud-controls-matrix
- NIST SP 800-63C, Federation and Assertions — https://csrc.nist.gov/pubs/sp/800/63/3/final

## Hands-on practice tasks

1. Draw the landing zone as a table with one row per account or subscription, and justify each boundary by naming what would have to be compromised for two of them to fall together. <!-- id: advance-04-t01 band: focused energy: normal -->
2. Build a two-account hierarchy with one OU or management group, attach a single deny SCP or Azure Policy, and confirm the guardrail is inherited by a newly created account. <!-- id: advance-04-t02 band: deep energy: high -->
3. Write a permission boundary, attach it to a role that holds `AdministratorAccess`, attempt a denied action, and record the `AccessDenied` with the date as evidence the ceiling is enforced. <!-- id: advance-04-t03 band: deep energy: high -->
4. Generate a least-privilege policy from 30–90 days of real activity for one role, then remove at least three permissions and justify each removal in writing. <!-- id: advance-04-t04 band: deep energy: high -->
5. Write a trust policy that requires fresh MFA, then attempt to reach that role through a chained assumption and document the failure and its cause. <!-- id: advance-04-t05 band: focused energy: normal -->
6. Give one workload — a CI pipeline, a container, or a virtual machine — an identity with no static credential, then delete the access key it used to have and prove the workload still runs. <!-- id: advance-04-t06 band: deep energy: high -->
7. Encode one guardrail as policy-as-code, wire it into a CI check that reads a Terraform plan, and make it fail on a deliberately non-compliant change. <!-- id: advance-04-t07 band: deep energy: high -->
8. Design a break-glass path with two accounts, offline credentials, alerting, and a post-use ritual, then rehearse it end to end and write the use record including the time from decision to access. <!-- id: advance-04-t08 band: deep energy: high -->
9. Write the detection queries for break-glass use, privileged role changes made outside the elevation process, and trust-policy edits, in KQL and in a CloudTrail query. <!-- id: advance-04-t09 band: focused energy: normal -->
10. Build a control inventory of every guardrail in your design and mark each one as exists, enforced, or monitored, with the evidence that supports the classification. <!-- id: advance-04-t10 band: focused energy: normal -->
11. Write the rejected-alternatives section for one design decision, naming four alternatives and the specific reason each one lost. <!-- id: advance-04-t11 band: quick energy: low -->

## Deliverable / proof of work

Create `portfolio/advance/04-cloud-identity-architecture.md` with:

- The landing zone design as a table, with each boundary justified by blast radius rather than by the org chart
- The Terraform or CLI used to build the hierarchy, and evidence that a new account inherited the guardrail
- A service control policy or Azure Policy definition, with the attach target and the reason for that target
- A permission boundary, the role it is attached to, and a recorded `AccessDenied` proving the ceiling holds
- A least-privilege policy with the generated version, the shipped version, and a written justification for every permission removed
- A trust policy requiring fresh MFA, plus the documented result of the role-chaining failure and its explanation
- A workload identity configured with no static credential, and the deleted access key it replaced
- A policy-as-code guardrail, the CI check that runs it, and a screenshot or log of it failing a non-compliant plan
- A break-glass design with all six components, and a completed use record from a rehearsal including the time to access
- The detection queries for break-glass use, privileged role changes, and trust-policy edits
- A control inventory marking every guardrail exists, enforced, or monitored
- The rejected-alternatives section for one design decision

## Checklist

- [ ] I can explain why the account or subscription is the boundary and a folder is not. <!-- id: advance-04-landing-zone-design energy: low -->
- [ ] I designed a landing zone and justified every boundary by blast radius. <!-- id: advance-04-ou-hierarchy energy: normal -->
- [ ] I attached a service control policy or Azure Policy and confirmed a new account inherited it. <!-- id: advance-04-scp-enforced energy: normal -->
- [ ] I wrote a permission boundary and proved with an `AccessDenied` that it caps an over-permissive role. <!-- id: advance-04-permission-boundary energy: normal -->
- [ ] I generated a least-privilege policy from real activity and shrank it with written justification. <!-- id: advance-04-least-privilege-policy energy: high -->
- [ ] I wrote a trust policy that constrains who may assume a role, under what conditions, and for how long. <!-- id: advance-04-role-trust-policy energy: normal -->
- [ ] I can explain why the MFA context does not survive a chained role assumption. <!-- id: advance-04-federation-sso energy: low -->
- [ ] I gave a workload an identity with no static credential and deleted the key it used to hold. <!-- id: advance-04-workload-identity energy: normal -->
- [ ] No long-lived credential exists for any identity in my design that does not have to exist. <!-- id: advance-04-secrets-no-static-keys energy: normal -->
- [ ] I encoded a guardrail as policy-as-code and made it fail a real plan in CI. <!-- id: advance-04-policy-as-code energy: high -->
- [ ] I designed and rehearsed a break-glass path and wrote the post-use record, including the time to access. <!-- id: advance-04-break-glass-tested energy: high -->
- [ ] I wrote a key policy that separates key administration from key use. <!-- id: advance-04-kms-key-policy energy: normal -->
- [ ] I can explain why egress control and flow logs change incident outcomes. <!-- id: advance-04-network-segmentation energy: low -->
- [ ] I designed organisational logging with a stated retention period and treated it as an evidence deadline. <!-- id: advance-04-org-scale-logging energy: normal -->
- [ ] I classified every guardrail I own as exists, enforced, or monitored, with the evidence behind the classification. <!-- id: advance-04-control-enforced-vs-exists energy: normal -->
- [ ] I wrote the rejected alternatives for one design decision, with the reason each alternative lost. <!-- id: advance-04-rejected-alternatives energy: low -->

## You're ready to move on when...

You can design a landing zone, write enforced permission-boundary and SCP guardrails as reviewed policy-as-code, federate human and workload identity without static keys, and rehearse a break-glass path that ends in a written record.

## Free vs Paid

### What's free and enough

Everything this phase teaches can be built on free tiers. AWS Organizations, service control policies, IAM permission boundaries, IAM Identity Center, and CloudTrail management events cost nothing at the scale of a personal account, and Azure management groups, Azure Policy, and the Entra ID free tier are the same story on the Microsoft side. Terraform, Open Policy Agent, Conftest, and Checkov are all free and open source, and they are the actual tooling a great many production teams use rather than a cut-down substitute. Rego and the Terraform AWS provider both have documentation good enough to learn from directly, and the AWS Security Reference Architecture, the Well-Architected Security Pillar, and NIST SP 800-207 are free and are the documents the designs in this phase are derived from. A personal AWS account and a personal Entra ID tenant, both free, are sufficient for every task here.

The honest limit is where the free tier stops. Customer-managed KMS keys are charged per key and per request, Secrets Manager is charged per secret, AWS Config is charged per configuration item, and CloudTrail data events are charged. Design all of those on paper, prove the mechanism where you can with the free AWS-managed keys and the free SSM Parameter Store standard tier, and write down which parts you designed without running. That distinction is a strength in a portfolio, not an admission.

### What's paid and why you'd upgrade

Enterprise cloud security posture platforms such as Wiz, Prisma Cloud, and Orca add graph-based analysis across an entire estate, agentless workload scanning, and continuous compliance reporting with an evidence trail. Paid identity governance products add entitlement review workflows and automated access certification. HashiCorp Vault's enterprise features add dynamic credential issuance and multi-tenant secret isolation. Paid training and certification tracks, including the AWS and Azure security certifications, are the largest line item in this space, and for someone already in a security role they are almost always employer-funded rather than self-funded. Commercial SIEM and XDR platforms add correlation and retention that a free tier cannot, which matters at organisational scale and not at all for practice.

### When it's worth paying

Pay when your employer's environment is large enough that nobody can answer a question by reading a handful of policies — that is the point at which graph analysis and continuous compliance reporting start saving real time. Pay when a compliance obligation requires an evidence trail that a manual process cannot produce, because then the cost of not paying is a failed audit rather than a slower workflow. Pay when a cloud certification is a stated requirement of a role you are moving into, and let the employer fund it. For learning and for building the portfolio this phase asks for, none of that applies: the free tier covers the mechanism, the free tooling covers the automation, and the artefacts you produce are what a hiring manager reads. The phase is designed so that the thing you cannot do for free is the thing you can describe accurately without having done it, which is a smaller gap than it sounds and an easy one to close in the first month of a role that gives you a real tenant.