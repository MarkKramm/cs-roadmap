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

# Cloud IAM policy and identity artefacts — rows 91–135 of this class

This is part 3 of 4. **Verify only the rows below.** The other parts are separate messages and their rows are not repeated here.

| 91 | `04-phase-cloud-identity-architecture.md:1110` ▶ | "kms:UntagResource", | **OK** — AWS Service Authorization Reference (AWS Key Management Service, service prefix: `kms`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_awskms.html — "UntagResource … Controls permission to delete tags that are attached to an AWS KMS key" |
| | | <sub>↑ "kms:TagResource",<br>↓ "kms:ScheduleKeyDeletion",</sub> | |
| 92 | `04-phase-cloud-identity-architecture.md:1111` ▶ | "kms:ScheduleKeyDeletion", | **OK** — AWS Service Authorization Reference (service prefix: `kms`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_awskms.html — "ScheduleKeyDeletion … Controls permission to schedule deletion of an AWS KMS key" |
| | | <sub>↑ "kms:UntagResource",<br>↓ "kms:CancelKeyDeletion"</sub> | |
| 93 | `04-phase-cloud-identity-architecture.md:1112` ▶ | "kms:CancelKeyDeletion" | **OK** — AWS Service Authorization Reference (service prefix: `kms`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_awskms.html — "CancelKeyDeletion … Controls permission to cancel the scheduled deletion of an AWS KMS key" |
| | | <sub>↑ "kms:ScheduleKeyDeletion",<br>↓ ],</sub> | |
| 94 | `04-phase-cloud-identity-architecture.md:1123` ▶ | "kms:Decrypt", | **OK** — AWS Service Authorization Reference (service prefix: `kms`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_awskms.html — "Decrypt … Controls permission to decrypt ciphertext that was encrypted under an AWS KMS key" |
| | | <sub>↑ "Action": [<br>↓ "kms:DescribeKey",</sub> | |
| 95 | `04-phase-cloud-identity-architecture.md:1124` ▶ | "kms:DescribeKey", | **OK** — AWS Service Authorization Reference (service prefix: `kms`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_awskms.html — "DescribeKey … Controls permission to view detailed information about an AWS KMS key" |
| | | <sub>↑ "kms:Decrypt",<br>↓ "kms:GenerateDataKey"</sub> | |
| 96 | `04-phase-cloud-identity-architecture.md:1125` ▶ | "kms:GenerateDataKey" | **OK** — AWS Service Authorization Reference (service prefix: `kms`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_awskms.html — "GenerateDataKey … Controls permission to use the AWS KMS key to generate data keys" |
| | | <sub>↑ "kms:DescribeKey",<br>↓ ],</sub> | |
| 97 | `04-phase-cloud-identity-architecture.md:1134` ▶ | "kms:DeleteImportedKeyMaterial" | **OK** — AWS Service Authorization Reference (service prefix: `kms`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_awskms.html — "DeleteImportedKeyMaterial … Controls permission to delete cryptographic material that you imported into an AWS KMS key" |
| | | <sub>↑ "Action": [<br>↓ ],</sub> | |
| 98 | `04-phase-cloud-identity-architecture.md:1146` | **The second and third statements are deliberately disjoint.** `KeyAdministratorRole` has `kms:Create*` and `kms:ScheduleKeyDeletion` but not `kms:Decrypt`. `PaymentsApiTaskRole` has `kms:Decrypt` but cannot change the key policy. An administrator who cannot r … | **UNVERIFIABLE** — design rationale about the phase's own example key policy, not a fact about AWS. I read the JSON at :1080–1139: the specifics are right (statement 2 has `kms:Create*` and `kms:ScheduleKeyDeletion` and no `kms:Decrypt`; statement 3 has `kms:Decrypt` and no `kms:PutKeyPolicy`), and the sentence names the correct statements. One imprecision: "disjoint" is not literal — `kms:DescribeKey` is in both, listed outright at :1124 and matched by `kms:Describe*` at :1102. |
| 99 | `04-phase-cloud-identity-architecture.md:1150` | **`kms:ScheduleKeyDeletion` is granted to administrators and denied to nobody.** That looks like a gap and it is a deliberate one: deleting a key is sometimes necessary, and the control that prevents an accident is the mandatory waiting period AWS enforces, pl … | **OK** — vendor API reference, https://docs.aws.amazon.com/kms/latest/APIReference/API_ScheduleKeyDeletion.html — "By default, AWS KMS applies a waiting period of 30 days, but you can specify a waiting period of 7-30 days … Before the waiting period ends, you can use CancelKeyDeletion to cancel the deletion of the KMS key." The "granted to administrators, denied to nobody" half also checks out against the JSON at :1093–1137 (statement 2 grants it; the only `Deny`, statement 4, covers `kms:DeleteImportedKeyMaterial` alone). Two refinements: the waiting period delays deletion rather than preventing it, and it governs *scheduled* deletion — `kms:ScheduleKeyDeletion` itself is the permission that puts the key into `PendingDeletion`. |
| 100 | `04-phase-cloud-identity-architecture.md:1177` | \| **At apply time, by the platform** \| A change that bypasses the pipeline entirely \| An SCP that denies `iam:CreateUser` \| | **OK** — AWS Service Authorization Reference (IAM, service prefix: `iam`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "CreateUser … Grants permission to create a new IAM user". The action is real and can appear in an SCP. The column's placement of SCPs under "at apply time" is an editorial taxonomy, not something AWS states. |
| 101 | `04-phase-cloud-identity-architecture.md:1422` ▶ | Action = "sts:AssumeRoleWithSAML" | **OK** — vendor reference documentation, https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_saml.html — `"Principal": {"Federated": "arn:aws:iam::{{111122223333}}:saml-provider/ExampleOrgSSOProvider"}, "Action": "sts:AssumeRoleWithSAML"`. Both the `Federated` principal type and the action are AWS's own documented pair. The adjacent `SAML:aud` value in the phase file is also correct: the same page shows `"saml:aud": "https://{{us-east-1}}.signin.aws.amazon.com/saml"` and states "The following example shows the sign-in URL format with the optional `region-code`", so the region-less global form `https://signin.aws.amazon.com/saml` is documented. |
| | | <sub>↑ }<br>↓ Condition = {</sub> | |
| 102 | `04-phase-cloud-identity-architecture.md:1527` | \| Egress firewall permitting a destination list \| A `kms:ViaService` condition \| | **UNVERIFIABLE** — the row is an analogy ("its identity-plane twin"), which is teaching method, not a fact about the world. The condition key it names is real: vendor developer guide, https://docs.aws.amazon.com/kms/latest/developerguide/conditions-kms.html — "The `kms:ViaService` condition key limits use of an KMS key to requests from specified AWS services." Note it restricts which AWS service may use a key; the pairing with an egress firewall is the author's judgement, not a documented equivalence. |
| | | <sub>↑ \| Security group allowing one port from one source \| A trust policy pinned to one repository and one branch \|<br>↓ \| VPC endpoint policy \| A resource-based policy that refuses anything the identity policy missed \|</sub> | |
| 103 | `04-phase-cloud-identity-architecture.md:1606` ▶ | "iam:Get*", | **OK** — vendor reference, https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_action.html — "You can also use wildcards (`*` or `?`) as part of the action name." The prefix-plus-wildcard form is valid and matches real IAM actions, e.g. `iam:GetRole` in the Service Authorization Reference (https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html). |
| | | <sub>↑ "Action": [<br>↓ "iam:List*",</sub> | |
| 104 | `04-phase-cloud-identity-architecture.md:1607` ▶ | "iam:List*", | **OK** — vendor reference, https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_action.html — "You can also use wildcards (`*` or `?`) as part of the action name." Matches real IAM actions, e.g. `iam:ListUsers` in the Service Authorization Reference (https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html). |
| | | <sub>↑ "iam:Get*",<br>↓ "iam:PassRole",</sub> | |
| 105 | `04-phase-cloud-identity-architecture.md:1608` ▶ | "iam:PassRole", | **OK** — AWS Service Authorization Reference (IAM, service prefix: `iam`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "PassRole … Grants permission to pass a role to a service" |
| | | <sub>↑ "iam:List*",<br>↓ "iam:TagRole",</sub> | |
| 106 | `04-phase-cloud-identity-architecture.md:1609` ▶ | "iam:TagRole", | **OK** — AWS Service Authorization Reference (service prefix: `iam`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "TagRole … Grants permission to add tags to an IAM role" |
| | | <sub>↑ "iam:PassRole",<br>↓ "iam:UntagRole",</sub> | |
| 107 | `04-phase-cloud-identity-architecture.md:1610` ▶ | "iam:UntagRole", | **OK** — AWS Service Authorization Reference (service prefix: `iam`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "UntagRole … Grants permission to remove the specified tags from the role" |
| | | <sub>↑ "iam:TagRole",<br>↓ "sts:GetCallerIdentity",</sub> | |
| 108 | `04-phase-cloud-identity-architecture.md:1611` ▶ | "sts:GetCallerIdentity", | **OK** — AWS Service Authorization Reference (AWS Security Token Service, service prefix: `sts`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_awssts.html — "GetCallerIdentity … Grants permission to obtain details about the IAM identity whose credentials are used to call the API" |
| | | <sub>↑ "iam:UntagRole",<br>↓ "sts:AssumeRole"</sub> | |
| 109 | `04-phase-cloud-identity-architecture.md:1612` ▶ | "sts:AssumeRole" | **OK** — AWS Service Authorization Reference (service prefix: `sts`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_awssts.html — "AssumeRole … Grants permission to obtain a set of temporary security credentials that you can use to access AWS resources" |
| | | <sub>↑ "sts:GetCallerIdentity",<br>↓ ],</sub> | |
| 110 | `04-phase-cloud-identity-architecture.md:1636` ▶ | "iam:Get*", | **OK** — vendor reference, https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_action.html — "You can also use wildcards (`*` or `?`) as part of the action name." The context line above it, `resource-groups:*`, is also valid: `resource-groups` is a real service prefix (https://docs.aws.amazon.com/service-authorization/latest/reference/list_resource-groups.html — "AWS Resource Groups (service prefix: `resource-groups`)"). Note `Action` and `NotAction` are mutually exclusive but coexist in *different* statements, which is what this policy does. |
| | | <sub>↑ "resource-groups:*",<br>↓ "iam:List*",</sub> | |
| 111 | `04-phase-cloud-identity-architecture.md:1637` ▶ | "iam:List*", | **OK** — vendor reference, https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_action.html — "You can also use wildcards (`*` or `?`) as part of the action name." Matches real IAM actions, e.g. `iam:ListUsers` (https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html). |
| | | <sub>↑ "iam:Get*",<br>↓ "iam:PassRole",</sub> | |
| 112 | `04-phase-cloud-identity-architecture.md:1638` ▶ | "iam:PassRole", | **OK** — AWS Service Authorization Reference (service prefix: `iam`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "PassRole … Grants permission to pass a role to a service" |
| | | <sub>↑ "iam:List*",<br>↓ "iam:TagRole",</sub> | |
| 113 | `04-phase-cloud-identity-architecture.md:1639` ▶ | "iam:TagRole", | **OK** — AWS Service Authorization Reference (service prefix: `iam`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "TagRole … Grants permission to add tags to an IAM role" |
| | | <sub>↑ "iam:PassRole",<br>↓ "iam:UntagRole",</sub> | |
| 114 | `04-phase-cloud-identity-architecture.md:1640` ▶ | "iam:UntagRole", | **OK** — AWS Service Authorization Reference (service prefix: `iam`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "UntagRole … Grants permission to remove the specified tags from the role" |
| | | <sub>↑ "iam:TagRole",<br>↓ "sts:GetCallerIdentity",</sub> | |
| 115 | `04-phase-cloud-identity-architecture.md:1641` ▶ | "sts:GetCallerIdentity", | **OK** — AWS Service Authorization Reference (service prefix: `sts`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_awssts.html — "GetCallerIdentity … Grants permission to obtain details about the IAM identity whose credentials are used to call the API" |
| | | <sub>↑ "iam:UntagRole",<br>↓ "sts:AssumeRole"</sub> | |
| 116 | `04-phase-cloud-identity-architecture.md:1642` ▶ | "sts:AssumeRole" | **OK** — AWS Service Authorization Reference (service prefix: `sts`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_awssts.html — "AssumeRole … Grants permission to obtain a set of temporary security credentials that you can use to access AWS resources" |
| | | <sub>↑ "sts:GetCallerIdentity",<br>↓ ],</sub> | |
| 117 | `04-phase-cloud-identity-architecture.md:1650` ▶ | "iam:CreateUser", | **OK** — AWS Service Authorization Reference (IAM, service prefix: `iam`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "CreateUser … Grants permission to create a new IAM user" |
| | | <sub>↑ "Action": [<br>↓ "iam:CreateAccessKey",</sub> | |
| 118 | `04-phase-cloud-identity-architecture.md:1651` ▶ | "iam:CreateAccessKey", | **OK** — AWS Service Authorization Reference (service prefix: `iam`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "CreateAccessKey … Grants permission to create access key and secret access key for the specified IAM user" |
| | | <sub>↑ "iam:CreateUser",<br>↓ "iam:CreateLoginProfile",</sub> | |
| 119 | `04-phase-cloud-identity-architecture.md:1652` ▶ | "iam:CreateLoginProfile", | **OK** — AWS Service Authorization Reference (service prefix: `iam`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "CreateLoginProfile … Grants permission to create a password for the specified IAM user" |
| | | <sub>↑ "iam:CreateAccessKey",<br>↓ "iam:UpdateLoginProfile",</sub> | |
| 120 | `04-phase-cloud-identity-architecture.md:1653` ▶ | "iam:UpdateLoginProfile", | **OK** — AWS Service Authorization Reference (service prefix: `iam`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "UpdateLoginProfile … Grants permission to change the password for the specified IAM user" |
| | | <sub>↑ "iam:CreateLoginProfile",<br>↓ "iam:DeleteLoginProfile",</sub> | |
| 121 | `04-phase-cloud-identity-architecture.md:1654` ▶ | "iam:DeleteLoginProfile", | **OK** — AWS Service Authorization Reference (service prefix: `iam`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "DeleteLoginProfile … Grants permission to delete the password for the specified IAM user" |
| | | <sub>↑ "iam:UpdateLoginProfile",<br>↓ "iam:AttachUserPolicy",</sub> | |
| 122 | `04-phase-cloud-identity-architecture.md:1655` ▶ | "iam:AttachUserPolicy", | **OK** — AWS Service Authorization Reference (service prefix: `iam`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "AttachUserPolicy … Grants permission to attach a managed policy to the specified IAM user" |
| | | <sub>↑ "iam:DeleteLoginProfile",<br>↓ "iam:PutUserPolicy",</sub> | |
| 123 | `04-phase-cloud-identity-architecture.md:1656` ▶ | "iam:PutUserPolicy", | **OK** — AWS Service Authorization Reference (service prefix: `iam`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "PutUserPolicy … Grants permission to create or update an inline policy document that is embedded in the specified IAM user" |
| | | <sub>↑ "iam:AttachUserPolicy",<br>↓ "iam:AddUserToGroup",</sub> | |
| 124 | `04-phase-cloud-identity-architecture.md:1657` ▶ | "iam:AddUserToGroup", | **OK** — AWS Service Authorization Reference (service prefix: `iam`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "AddUserToGroup … Grants permission to add an IAM user to the specified IAM group" |
| | | <sub>↑ "iam:PutUserPolicy",<br>↓ "iam:CreatePolicyVersion",</sub> | |
| 125 | `04-phase-cloud-identity-architecture.md:1658` ▶ | "iam:CreatePolicyVersion", | **OK** — AWS Service Authorization Reference (service prefix: `iam`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "CreatePolicyVersion … Grants permission to create a new version of the specified managed policy" |
| | | <sub>↑ "iam:AddUserToGroup",<br>↓ "iam:SetDefaultPolicyVersion",</sub> | |
| 126 | `04-phase-cloud-identity-architecture.md:1659` ▶ | "iam:SetDefaultPolicyVersion", | **OK** — AWS Service Authorization Reference (service prefix: `iam`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "SetDefaultPolicyVersion … Grants permission to set the version of the specified policy as the policy's default version" |
| | | <sub>↑ "iam:CreatePolicyVersion",<br>↓ "iam:DeleteRolePermissionsBoundary",</sub> | |
| 127 | `04-phase-cloud-identity-architecture.md:1660` ▶ | "iam:DeleteRolePermissionsBoundary", | **OK** — AWS Service Authorization Reference (service prefix: `iam`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "DeleteRolePermissionsBoundary … Grants permission to remove the permissions boundary from a role" |
| | | <sub>↑ "iam:SetDefaultPolicyVersion",<br>↓ "iam:PutRolePermissionsBoundary",</sub> | |
| 128 | `04-phase-cloud-identity-architecture.md:1661` ▶ | "iam:PutRolePermissionsBoundary", | **OK** — AWS Service Authorization Reference (service prefix: `iam`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "PutRolePermissionsBoundary … Grants permission to set a managed policy as a permissions boundary for a role" |
| | | <sub>↑ "iam:DeleteRolePermissionsBoundary",<br>↓ "iam:UpdateAssumeRolePolicy",</sub> | |
| 129 | `04-phase-cloud-identity-architecture.md:1662` ▶ | "iam:UpdateAssumeRolePolicy", | **OK** — AWS Service Authorization Reference (service prefix: `iam`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "UpdateAssumeRolePolicy … Grants permission to update the policy that grants an IAM entity permission to assume a role". The context line below it, `organizations:*`, is valid: `organizations` is a real service prefix (https://docs.aws.amazon.com/service-authorization/latest/reference/list_awsorganizations.html). |
| | | <sub>↑ "iam:PutRolePermissionsBoundary",<br>↓ "organizations:*",</sub> | |
| 130 | `04-phase-cloud-identity-architecture.md:1665` ▶ | "cloudtrail:StopLogging", | **OK** — AWS Service Authorization Reference (AWS CloudTrail, service prefix: `cloudtrail`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_cloudtrail.html — "StopLogging Grants permission to stop the recording of AWS API calls and log file delivery for a trail". The context line above it, `account:*`, is valid: `account` is a real service prefix (https://docs.aws.amazon.com/service-authorization/latest/reference/list_account.html). |
| | | <sub>↑ "account:*",<br>↓ "cloudtrail:DeleteTrail",</sub> | |
| 131 | `04-phase-cloud-identity-architecture.md:1666` ▶ | "cloudtrail:DeleteTrail", | **OK** — AWS Service Authorization Reference (service prefix: `cloudtrail`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_cloudtrail.html — "DeleteTrail Grants permission to delete a trail" |
| | | <sub>↑ "cloudtrail:StopLogging",<br>↓ "cloudtrail:UpdateTrail",</sub> | |
| 132 | `04-phase-cloud-identity-architecture.md:1667` ▶ | "cloudtrail:UpdateTrail", | **OK** — AWS Service Authorization Reference (service prefix: `cloudtrail`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_cloudtrail.html — "UpdateTrail Grants permission to update the settings that specify delivery of log files" |
| | | <sub>↑ "cloudtrail:DeleteTrail",<br>↓ "config:StopConfigurationRecorder",</sub> | |
| 133 | `04-phase-cloud-identity-architecture.md:1668` ▶ | "config:StopConfigurationRecorder", | **OK** — AWS Service Authorization Reference (AWS Config, service prefix: `config`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_config.html — "StopConfigurationRecorder Grants permission to the customer managed configuration recorder to stop recording configurations". (The AWS Config reference page is `list_config.html`; the `list_awsconfig.html` form 404s to the index.) |
| | | <sub>↑ "cloudtrail:UpdateTrail",<br>↓ "config:DeleteConfigurationRecorder",</sub> | |
| 134 | `04-phase-cloud-identity-architecture.md:1669` ▶ | "config:DeleteConfigurationRecorder", | **OK** — AWS Service Authorization Reference (service prefix: `config`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_config.html — "DeleteConfigurationRecorder Grants permission to delete the customer managed configuration recorder" |
| | | <sub>↑ "config:StopConfigurationRecorder",<br>↓ "config:DeleteDeliveryChannel"</sub> | |
| 135 | `04-phase-cloud-identity-architecture.md:1670` ▶ | "config:DeleteDeliveryChannel" | **OK** — AWS Service Authorization Reference (service prefix: `config`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_config.html — "DeleteDeliveryChannel Grants permission to delete the delivery channel" |
| | | <sub>↑ "config:DeleteConfigurationRecorder",<br>↓ ],</sub> | |
