You are verifying technical claims from a training curriculum against
**primary sources** — Microsoft Learn, IANA, RFCs, POSIX man pages, and vendor
documentation.

The table below is complete and self-contained. Every row you need is here.

## What to do

For each row, replace the empty last column with exactly one of:

| Verdict | Format |
|---|---|
| `OK` | `OK` — then the **URL** that settles it, and a short quote from it |
| `WRONG` | `WRONG` — the correct value, **and** the URL that proves it |
| `UNVERIFIABLE` | `UNVERIFIABLE` — say briefly why (judgement, analogy, or simplification) |

## Rules

1. **Every `OK` and every `WRONG` must carry a source URL, and a quote from
   it that settles the claim.** The quote is not decoration: a URL alone says
   only that a page exists. If you cannot quote the line that decides the
   claim, the verdict is `UNVERIFIABLE`. A recollection is not a source.
2. **Prefer the authority over a page that agrees with it.** Rank sources:
   the standard itself (RFC, POSIX, FHS, IANA registry) > the vendor's own
   reference documentation > a vendor tutorial or blog > a forum answer or a
   third-party article. Use the highest rank you can reach, and **name the
   source type** in the verdict. A claim sourced to a forum post or a
   third-party tutorial is weaker evidence than the same claim sourced to the
   spec, and the reader needs to know which they are getting.
3. **Never cite a page you could not open or whose text you could not read.**
   If a source is paywalled, login-gated, blocked, or empty, it does not count
   as a source. Say so.
4. **Cite in the language you read.** If the only page you can reach is a
   localised version of the vendor's documentation, say that explicitly, and
   prefer finding the English original.
5. **Do not guess to fill a row.** An honest `UNVERIFIABLE` is a useful
   result; an invented URL is worse than no answer, because it will be acted on.
6. **Output the complete table, every row, in order.** Do not summarise, do not
   sample, do not stop early. If you run low on room, stop at a row boundary
   and say which row number to continue from.
7. **If any part of a row is unclear, say so in the verdict** (`UNVERIFIABLE —
   text truncated`) rather than inferring the claim. Never reconstruct a claim
   you cannot read.
8. Some short rows are followed by a small grey line showing the text above and
   below them. **That context is part of the claim** — use it.
9. `UNVERIFIABLE` is expected to be common and is not a failure. A great deal
   of this curriculum is teaching method, diagnostic reasoning, and worked
   examples, none of which is a fact about the world.
10. **A row's text may be cut off with a trailing `…` at 260 characters. Read
    the real line before judging it.** The Location column gives you
    `<phase-file>:<line>`, and the phase files are on disk at
    `career-roadmaps/advance-roadmap/` (IT: `it-roadmap/`, cyber:
    `cybersec-roadmap/`). Open that file, go to that line number, and judge the
    whole claim.

    This rule exists because of a recorded result, not a precaution. An earlier
    pass returned `UNVERIFIABLE — text truncated` on rows that were, in fact,
    fully checkable, because the pack was the only thing it was given — and an
    unverifiable row costs a reader the knowledge that nobody checked it. The
    truncation is a property of the TABLE FORMAT, not of the claim. Use
    `UNVERIFIABLE — text truncated` only when you genuinely cannot retrieve the
    line, and say that you tried.
11. **Write the verdict into the table in place.** Edit only the empty Verdict
    cell of each row. Do not reformat, reorder, re-quote the claim text, or add
    rows. The file must remain a valid markdown table with the same row numbers,
    because a script reads the verdicts back out of it by row number.
12. **Escape every `|` inside a verdict as `\|`.** A verdict that quotes a
    regex or a JSON schema — `^d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$`
    is the shape that causes it — puts a literal pipe in the cell, and each one
    silently becomes a column boundary. The row still starts with a number and
    still looks plausible; it is simply no longer a four-column row, and a
    script reading verdicts by row number will read a fragment of one.

# Cloud IAM policy and identity artefacts — rows 1–45 of this class

This is part 1 of 4. **Verify only the rows below.** The other parts are separate messages and their rows are not repeated here.

| 1 | `04-phase-cloud-identity-architecture.md:48` | - Role assumption: trust policies, `sts:AssumeRole`, session duration, external IDs, source identity, and confused-deputy problems | **UNVERIFIABLE** — a phase-objectives line (a topic list), not a falsifiable claim; the one embedded fact, `sts:AssumeRole`, is a real action in the AWS Service Authorization Reference |
| 2 | `04-phase-cloud-identity-architecture.md:287` ▶ | "organizations:LeaveOrganization", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_organizations.html — "LeaveOrganization Grants permission to remove a member account from its parent organization" |
| | | <sub>↑ "Action": [<br>↓ "organizations:DeleteOrganization",</sub> | |
| 3 | `04-phase-cloud-identity-architecture.md:288` ▶ | "organizations:DeleteOrganization", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_organizations.html — "DeleteOrganization Grants permission to delete the organization" |
| | | <sub>↑ "organizations:LeaveOrganization",<br>↓ "organizations:RemoveAccountFromOrganization"</sub> | |
| 4 | `04-phase-cloud-identity-architecture.md:289` ▶ | "organizations:RemoveAccountFromOrganization" | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_organizations.html — "RemoveAccountFromOrganization Grants permission to remove the specified account from the organization" |
| | | <sub>↑ "organizations:DeleteOrganization",<br>↓ ],</sub> | |
| 5 | `04-phase-cloud-identity-architecture.md:297` ▶ | "cloudtrail:StopLogging", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_cloudtrail.html — "StopLogging Grants permission to stop the recording of AWS API calls and log file delivery for a trail" |
| | | <sub>↑ "Action": [<br>↓ "cloudtrail:DeleteTrail",</sub> | |
| 6 | `04-phase-cloud-identity-architecture.md:298` ▶ | "cloudtrail:DeleteTrail", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_cloudtrail.html — "DeleteTrail Grants permission to delete a trail" |
| | | <sub>↑ "cloudtrail:StopLogging",<br>↓ "cloudtrail:UpdateTrail",</sub> | |
| 7 | `04-phase-cloud-identity-architecture.md:299` ▶ | "cloudtrail:UpdateTrail", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_cloudtrail.html — "UpdateTrail Grants permission to update the settings that specify delivery of log files" |
| | | <sub>↑ "cloudtrail:DeleteTrail",<br>↓ "cloudtrail:PutEventSelectors",</sub> | |
| 8 | `04-phase-cloud-identity-architecture.md:300` ▶ | "cloudtrail:PutEventSelectors", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_cloudtrail.html — "PutEventSelectors Grants permission to create and update event selectors for a trail" |
| | | <sub>↑ "cloudtrail:UpdateTrail",<br>↓ "config:DeleteConfigurationRecorder",</sub> | |
| 9 | `04-phase-cloud-identity-architecture.md:301` ▶ | "config:DeleteConfigurationRecorder", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_config.html — "DeleteConfigurationRecorder Grants permission to delete the customer managed configuration recorder" |
| | | <sub>↑ "cloudtrail:PutEventSelectors",<br>↓ "config:StopConfigurationRecorder",</sub> | |
| 10 | `04-phase-cloud-identity-architecture.md:302` ▶ | "config:StopConfigurationRecorder", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_config.html — "StopConfigurationRecorder Grants permission to the customer managed configuration recorder to stop recording configurations" |
| | | <sub>↑ "config:DeleteConfigurationRecorder",<br>↓ "config:DeleteDeliveryChannel",</sub> | |
| 11 | `04-phase-cloud-identity-architecture.md:303` ▶ | "config:DeleteDeliveryChannel", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_config.html — "DeleteDeliveryChannel Grants permission to delete the delivery channel" |
| | | <sub>↑ "config:StopConfigurationRecorder",<br>↓ "config:PutConfigurationRecorder"</sub> | |
| 12 | `04-phase-cloud-identity-architecture.md:304` ▶ | "config:PutConfigurationRecorder" | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_config.html — "PutConfigurationRecorder Grants permission to create or update a customer managed configuration recorder" |
| | | <sub>↑ "config:DeleteDeliveryChannel",<br>↓ ],</sub> | |
| 13 | `04-phase-cloud-identity-architecture.md:312` ▶ | "iam:CreateServiceLinkedRole", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "CreateServiceLinkedRole Grants permission to create an IAM role that allows an AWS service to perform actions on your behalf" |
| | | <sub>↑ "NotAction": [<br>↓ "iam:DeleteServiceLinkedRole",</sub> | |
| 14 | `04-phase-cloud-identity-architecture.md:313` ▶ | "iam:DeleteServiceLinkedRole", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "DeleteServiceLinkedRole Grants permission to delete an IAM role that is linked to a specific AWS service" |
| | | <sub>↑ "iam:CreateServiceLinkedRole",<br>↓ "iam:GetAccountSummary",</sub> | |
| 15 | `04-phase-cloud-identity-architecture.md:314` ▶ | "iam:GetAccountSummary", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "GetAccountSummary Grants permission to retrieve information about IAM entity usage and IAM quotas in the AWS account" |
| | | <sub>↑ "iam:DeleteServiceLinkedRole",<br>↓ "iam:ListAccountAliases",</sub> | |
| 16 | `04-phase-cloud-identity-architecture.md:315` ▶ | "iam:ListAccountAliases", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "ListAccountAliases Grants permission to list the account alias that is associated with the AWS account" |
| | | <sub>↑ "iam:GetAccountSummary",<br>↓ "account:EnableRegion",</sub> | |
| 17 | `04-phase-cloud-identity-architecture.md:316` ▶ | "account:EnableRegion", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_account.html — "EnableRegion Grants permission to enable use of a Region" |
| | | <sub>↑ "iam:ListAccountAliases",<br>↓ "account:DisableRegion",</sub> | |
| 18 | `04-phase-cloud-identity-architecture.md:317` ▶ | "account:DisableRegion", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_account.html — "DisableRegion Grants permission to disable use of a Region" |
| | | <sub>↑ "account:EnableRegion",<br>↓ "account:ListRegions",</sub> | |
| 19 | `04-phase-cloud-identity-architecture.md:318` ▶ | "account:ListRegions", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_account.html — "ListRegions Grants permission to list the available Regions" |
| | | <sub>↑ "account:DisableRegion",<br>↓ "account:GetAccountInformation",</sub> | |
| 20 | `04-phase-cloud-identity-architecture.md:319` ▶ | "account:GetAccountInformation", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_account.html — "GetAccountInformation Grants permission to retrieve the account information for an account" |
| | | <sub>↑ "account:ListRegions",<br>↓ "aws-portal:ViewBilling",</sub> | |
| 21 | `04-phase-cloud-identity-architecture.md:328` ▶ | "s3:PutAccountPublicAccessBlock", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_s3.html — "PutAccountPublicAccessBlock Grants permission to create or modify the PublicAccessBlock configuration for an AWS account" |
| | | <sub>↑ "cur:*",<br>↓ "s3:GetAccountPublicAccessBlock"</sub> | |
| 22 | `04-phase-cloud-identity-architecture.md:329` ▶ | "s3:GetAccountPublicAccessBlock" | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_s3.html — "GetAccountPublicAccessBlock Grants permission to retrieve the PublicAccessBlock configuration for an AWS account" |
| | | <sub>↑ "s3:PutAccountPublicAccessBlock",<br>↓ ],</sub> | |
| 23 | `04-phase-cloud-identity-architecture.md:334` ▶ | "aws:PrincipalArn": "arn:aws:iam::*:root" | **OK** — vendor reference (AWS global condition context keys), https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html — "aws:PrincipalArn Use this key to compare the Amazon Resource Name (ARN) of the principal that made the request"; the same page lists `arn:aws:iam::*:root` as an example value, and StringLike is documented as supporting `*` wildcards |
| | | <sub>↑ "StringLike": {<br>↓ }</sub> | |
| 24 | `04-phase-cloud-identity-architecture.md:348` | **`ProtectTheAuditTrail` denies the actions rather than the resource.** `cloudtrail:StopLogging` with `Resource: "*"` denies stopping any trail in the account. Writing `Resource` as a specific trail ARN would leave the next trail unprotected, which is the fail … | **UNVERIFIABLE** — a design rationale about how broad a deny should be, not a fact about the world; note `cloudtrail:StopLogging` does accept a required `trail` resource type, so the claim is a breadth judgement rather than a technical constraint |
| 25 | `04-phase-cloud-identity-architecture.md:411` ▶ | "ec2:Describe*", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_ec2.html — `ec2:Describe*` resolves to 194 real EC2 actions, e.g. "DescribeInstances Grants permission to describe one or more instances" |
| | | <sub>↑ "sqs:*",<br>↓ "ecr:*",</sub> | |
| 26 | `04-phase-cloud-identity-architecture.md:414` ▶ | "sts:GetCallerIdentity", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_sts.html — "GetCallerIdentity Grants permission to obtain details about the IAM identity whose credentials are used to call the API" |
| | | <sub>↑ "ecs:*",<br>↓ "tag:GetResources"</sub> | |
| 27 | `04-phase-cloud-identity-architecture.md:415` ▶ | "tag:GetResources" | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_resourcegroupstaggingapi.html — "GetResources Grants permission to return tagged or previously tagged resources in the specified AWS Region"; the prefix is genuinely `tag:`, not a typo |
| | | <sub>↑ "sts:GetCallerIdentity",<br>↓ ],</sub> | |
| 28 | `04-phase-cloud-identity-architecture.md:423` ▶ | "iam:Get*", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — `iam:Get*` resolves to 34 real IAM actions, e.g. "GetAccessKeyLastUsed", "GetAccountAuthorizationDetails", "GetAccountSummary" |
| | | <sub>↑ "Action": [<br>↓ "iam:List*",</sub> | |
| 29 | `04-phase-cloud-identity-architecture.md:424` ▶ | "iam:List*", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — `iam:List*` resolves to 38 real IAM actions, e.g. "ListAccountAliases", "ListAccessKeys", "ListAttachedGroupPolicies" |
| | | <sub>↑ "iam:Get*",<br>↓ "iam:PassRole"</sub> | |
| 30 | `04-phase-cloud-identity-architecture.md:425` ▶ | "iam:PassRole" | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "PassRole Grants permission to pass a role to a service" |
| | | <sub>↑ "iam:List*",<br>↓ ],</sub> | |
| 31 | `04-phase-cloud-identity-architecture.md:440` ▶ | "ec2:Describe*", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_ec2.html — `ec2:Describe*` resolves to 194 real EC2 actions, e.g. "DescribeInstances Grants permission to describe one or more instances" |
| | | <sub>↑ "sqs:*",<br>↓ "ecr:*",</sub> | |
| 32 | `04-phase-cloud-identity-architecture.md:443` ▶ | "sts:GetCallerIdentity", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_sts.html — "GetCallerIdentity Grants permission to obtain details about the IAM identity whose credentials are used to call the API" |
| | | <sub>↑ "ecs:*",<br>↓ "tag:GetResources",</sub> | |
| 33 | `04-phase-cloud-identity-architecture.md:444` ▶ | "tag:GetResources", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_resourcegroupstaggingapi.html — "GetResources Grants permission to return tagged or previously tagged resources in the specified AWS Region"; the prefix is genuinely `tag:` |
| | | <sub>↑ "sts:GetCallerIdentity",<br>↓ "iam:Get*",</sub> | |
| 34 | `04-phase-cloud-identity-architecture.md:445` ▶ | "iam:Get*", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — `iam:Get*` resolves to 34 real IAM actions, e.g. "GetAccessKeyLastUsed", "GetAccountAuthorizationDetails", "GetAccountSummary" |
| | | <sub>↑ "tag:GetResources",<br>↓ "iam:List*",</sub> | |
| 35 | `04-phase-cloud-identity-architecture.md:446` ▶ | "iam:List*", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — `iam:List*` resolves to 38 real IAM actions, e.g. "ListAccountAliases", "ListAccessKeys", "ListAttachedGroupPolicies" |
| | | <sub>↑ "iam:Get*",<br>↓ "iam:PassRole"</sub> | |
| 36 | `04-phase-cloud-identity-architecture.md:447` ▶ | "iam:PassRole" | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "PassRole Grants permission to pass a role to a service" |
| | | <sub>↑ "iam:List*",<br>↓ ],</sub> | |
| 37 | `04-phase-cloud-identity-architecture.md:455` ▶ | "iam:CreateUser", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "CreateUser Grants permission to create a new IAM user" |
| | | <sub>↑ "Action": [<br>↓ "iam:CreateAccessKey",</sub> | |
| 38 | `04-phase-cloud-identity-architecture.md:456` ▶ | "iam:CreateAccessKey", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "CreateAccessKey Grants permission to create access key and secret access key for the specified IAM user" |
| | | <sub>↑ "iam:CreateUser",<br>↓ "iam:CreateLoginProfile",</sub> | |
| 39 | `04-phase-cloud-identity-architecture.md:457` ▶ | "iam:CreateLoginProfile", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "CreateLoginProfile Grants permission to create a password for the specified IAM user" |
| | | <sub>↑ "iam:CreateAccessKey",<br>↓ "iam:UpdateLoginProfile",</sub> | |
| 40 | `04-phase-cloud-identity-architecture.md:458` ▶ | "iam:UpdateLoginProfile", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "UpdateLoginProfile Grants permission to change the password for the specified IAM user" |
| | | <sub>↑ "iam:CreateLoginProfile",<br>↓ "iam:AttachUserPolicy",</sub> | |
| 41 | `04-phase-cloud-identity-architecture.md:459` ▶ | "iam:AttachUserPolicy", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "AttachUserPolicy Grants permission to attach a managed policy to the specified IAM user" |
| | | <sub>↑ "iam:UpdateLoginProfile",<br>↓ "iam:PutUserPolicy",</sub> | |
| 42 | `04-phase-cloud-identity-architecture.md:460` ▶ | "iam:PutUserPolicy", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "PutUserPolicy Grants permission to create or update an inline policy document that is embedded in the specified IAM user" |
| | | <sub>↑ "iam:AttachUserPolicy",<br>↓ "iam:AddUserToGroup",</sub> | |
| 43 | `04-phase-cloud-identity-architecture.md:461` ▶ | "iam:AddUserToGroup", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "AddUserToGroup Grants permission to add an IAM user to the specified IAM group" |
| | | <sub>↑ "iam:PutUserPolicy",<br>↓ "organizations:*",</sub> | |
| 44 | `04-phase-cloud-identity-architecture.md:477` | **The fourth statement denies even the things the first allows.** `iam:PassRole` is in the first statement because roles that create compute need it. `iam:CreateUser` and `iam:CreateAccessKey` are not, and the fourth statement makes that explicit rather than r … | **WRONG** — `iam:PassRole` is in the **second** statement (`PermitReadOnlyIdentityContext`, line 425), not the first; the fourth statement therefore overlaps the second, not the first, and denies none of the first statement's actions — https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "PassRole Grants permission to pass a role to a service" |
| 45 | `04-phase-cloud-identity-architecture.md:508` ▶ | "sts:GetCallerIdentity", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_sts.html — "GetCallerIdentity Grants permission to obtain details about the IAM identity whose credentials are used to call the API" |
| | | <sub>↑ "s3:*", "dynamodb:*", "lambda:*", "logs:*", "cloudwatch:*",<br>↓ ]</sub> | |
