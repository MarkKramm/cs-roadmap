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

| 91 | `04-phase-cloud-identity-architecture.md:1110` ▶ | "kms:UntagResource", | |
| | | <sub>↑ "kms:TagResource",<br>↓ "kms:ScheduleKeyDeletion",</sub> | |
| 92 | `04-phase-cloud-identity-architecture.md:1111` ▶ | "kms:ScheduleKeyDeletion", | |
| | | <sub>↑ "kms:UntagResource",<br>↓ "kms:CancelKeyDeletion"</sub> | |
| 93 | `04-phase-cloud-identity-architecture.md:1112` ▶ | "kms:CancelKeyDeletion" | |
| | | <sub>↑ "kms:ScheduleKeyDeletion",<br>↓ ],</sub> | |
| 94 | `04-phase-cloud-identity-architecture.md:1123` ▶ | "kms:Decrypt", | |
| | | <sub>↑ "Action": [<br>↓ "kms:DescribeKey",</sub> | |
| 95 | `04-phase-cloud-identity-architecture.md:1124` ▶ | "kms:DescribeKey", | |
| | | <sub>↑ "kms:Decrypt",<br>↓ "kms:GenerateDataKey"</sub> | |
| 96 | `04-phase-cloud-identity-architecture.md:1125` ▶ | "kms:GenerateDataKey" | |
| | | <sub>↑ "kms:DescribeKey",<br>↓ ],</sub> | |
| 97 | `04-phase-cloud-identity-architecture.md:1134` ▶ | "kms:DeleteImportedKeyMaterial" | |
| | | <sub>↑ "Action": [<br>↓ ],</sub> | |
| 98 | `04-phase-cloud-identity-architecture.md:1146` | **The second and third statements are deliberately disjoint.** `KeyAdministratorRole` has `kms:Create*` and `kms:ScheduleKeyDeletion` but not `kms:Decrypt`. `PaymentsApiTaskRole` has `kms:Decrypt` but cannot change the key policy. An administrator who cannot r … | |
| 99 | `04-phase-cloud-identity-architecture.md:1150` | **`kms:ScheduleKeyDeletion` is granted to administrators and denied to nobody.** That looks like a gap and it is a deliberate one: deleting a key is sometimes necessary, and the control that prevents an accident is the mandatory waiting period AWS enforces, pl … | |
| 100 | `04-phase-cloud-identity-architecture.md:1177` | \| **At apply time, by the platform** \| A change that bypasses the pipeline entirely \| An SCP that denies `iam:CreateUser` \| | |
| 101 | `04-phase-cloud-identity-architecture.md:1422` ▶ | Action = "sts:AssumeRoleWithSAML" | |
| | | <sub>↑ }<br>↓ Condition = {</sub> | |
| 102 | `04-phase-cloud-identity-architecture.md:1527` | \| Egress firewall permitting a destination list \| A `kms:ViaService` condition \| | |
| | | <sub>↑ \| Security group allowing one port from one source \| A trust policy pinned to one repository and one branch \|<br>↓ \| VPC endpoint policy \| A resource-based policy that refuses anything the identity policy missed \|</sub> | |
| 103 | `04-phase-cloud-identity-architecture.md:1606` ▶ | "iam:Get*", | |
| | | <sub>↑ "Action": [<br>↓ "iam:List*",</sub> | |
| 104 | `04-phase-cloud-identity-architecture.md:1607` ▶ | "iam:List*", | |
| | | <sub>↑ "iam:Get*",<br>↓ "iam:PassRole",</sub> | |
| 105 | `04-phase-cloud-identity-architecture.md:1608` ▶ | "iam:PassRole", | |
| | | <sub>↑ "iam:List*",<br>↓ "iam:TagRole",</sub> | |
| 106 | `04-phase-cloud-identity-architecture.md:1609` ▶ | "iam:TagRole", | |
| | | <sub>↑ "iam:PassRole",<br>↓ "iam:UntagRole",</sub> | |
| 107 | `04-phase-cloud-identity-architecture.md:1610` ▶ | "iam:UntagRole", | |
| | | <sub>↑ "iam:TagRole",<br>↓ "sts:GetCallerIdentity",</sub> | |
| 108 | `04-phase-cloud-identity-architecture.md:1611` ▶ | "sts:GetCallerIdentity", | |
| | | <sub>↑ "iam:UntagRole",<br>↓ "sts:AssumeRole"</sub> | |
| 109 | `04-phase-cloud-identity-architecture.md:1612` ▶ | "sts:AssumeRole" | |
| | | <sub>↑ "sts:GetCallerIdentity",<br>↓ ],</sub> | |
| 110 | `04-phase-cloud-identity-architecture.md:1636` ▶ | "iam:Get*", | |
| | | <sub>↑ "resource-groups:*",<br>↓ "iam:List*",</sub> | |
| 111 | `04-phase-cloud-identity-architecture.md:1637` ▶ | "iam:List*", | |
| | | <sub>↑ "iam:Get*",<br>↓ "iam:PassRole",</sub> | |
| 112 | `04-phase-cloud-identity-architecture.md:1638` ▶ | "iam:PassRole", | |
| | | <sub>↑ "iam:List*",<br>↓ "iam:TagRole",</sub> | |
| 113 | `04-phase-cloud-identity-architecture.md:1639` ▶ | "iam:TagRole", | |
| | | <sub>↑ "iam:PassRole",<br>↓ "iam:UntagRole",</sub> | |
| 114 | `04-phase-cloud-identity-architecture.md:1640` ▶ | "iam:UntagRole", | |
| | | <sub>↑ "iam:TagRole",<br>↓ "sts:GetCallerIdentity",</sub> | |
| 115 | `04-phase-cloud-identity-architecture.md:1641` ▶ | "sts:GetCallerIdentity", | |
| | | <sub>↑ "iam:UntagRole",<br>↓ "sts:AssumeRole"</sub> | |
| 116 | `04-phase-cloud-identity-architecture.md:1642` ▶ | "sts:AssumeRole" | |
| | | <sub>↑ "sts:GetCallerIdentity",<br>↓ ],</sub> | |
| 117 | `04-phase-cloud-identity-architecture.md:1650` ▶ | "iam:CreateUser", | |
| | | <sub>↑ "Action": [<br>↓ "iam:CreateAccessKey",</sub> | |
| 118 | `04-phase-cloud-identity-architecture.md:1651` ▶ | "iam:CreateAccessKey", | |
| | | <sub>↑ "iam:CreateUser",<br>↓ "iam:CreateLoginProfile",</sub> | |
| 119 | `04-phase-cloud-identity-architecture.md:1652` ▶ | "iam:CreateLoginProfile", | |
| | | <sub>↑ "iam:CreateAccessKey",<br>↓ "iam:UpdateLoginProfile",</sub> | |
| 120 | `04-phase-cloud-identity-architecture.md:1653` ▶ | "iam:UpdateLoginProfile", | |
| | | <sub>↑ "iam:CreateLoginProfile",<br>↓ "iam:DeleteLoginProfile",</sub> | |
| 121 | `04-phase-cloud-identity-architecture.md:1654` ▶ | "iam:DeleteLoginProfile", | |
| | | <sub>↑ "iam:UpdateLoginProfile",<br>↓ "iam:AttachUserPolicy",</sub> | |
| 122 | `04-phase-cloud-identity-architecture.md:1655` ▶ | "iam:AttachUserPolicy", | |
| | | <sub>↑ "iam:DeleteLoginProfile",<br>↓ "iam:PutUserPolicy",</sub> | |
| 123 | `04-phase-cloud-identity-architecture.md:1656` ▶ | "iam:PutUserPolicy", | |
| | | <sub>↑ "iam:AttachUserPolicy",<br>↓ "iam:AddUserToGroup",</sub> | |
| 124 | `04-phase-cloud-identity-architecture.md:1657` ▶ | "iam:AddUserToGroup", | |
| | | <sub>↑ "iam:PutUserPolicy",<br>↓ "iam:CreatePolicyVersion",</sub> | |
| 125 | `04-phase-cloud-identity-architecture.md:1658` ▶ | "iam:CreatePolicyVersion", | |
| | | <sub>↑ "iam:AddUserToGroup",<br>↓ "iam:SetDefaultPolicyVersion",</sub> | |
| 126 | `04-phase-cloud-identity-architecture.md:1659` ▶ | "iam:SetDefaultPolicyVersion", | |
| | | <sub>↑ "iam:CreatePolicyVersion",<br>↓ "iam:DeleteRolePermissionsBoundary",</sub> | |
| 127 | `04-phase-cloud-identity-architecture.md:1660` ▶ | "iam:DeleteRolePermissionsBoundary", | |
| | | <sub>↑ "iam:SetDefaultPolicyVersion",<br>↓ "iam:PutRolePermissionsBoundary",</sub> | |
| 128 | `04-phase-cloud-identity-architecture.md:1661` ▶ | "iam:PutRolePermissionsBoundary", | |
| | | <sub>↑ "iam:DeleteRolePermissionsBoundary",<br>↓ "iam:UpdateAssumeRolePolicy",</sub> | |
| 129 | `04-phase-cloud-identity-architecture.md:1662` ▶ | "iam:UpdateAssumeRolePolicy", | |
| | | <sub>↑ "iam:PutRolePermissionsBoundary",<br>↓ "organizations:*",</sub> | |
| 130 | `04-phase-cloud-identity-architecture.md:1665` ▶ | "cloudtrail:StopLogging", | |
| | | <sub>↑ "account:*",<br>↓ "cloudtrail:DeleteTrail",</sub> | |
| 131 | `04-phase-cloud-identity-architecture.md:1666` ▶ | "cloudtrail:DeleteTrail", | |
| | | <sub>↑ "cloudtrail:StopLogging",<br>↓ "cloudtrail:UpdateTrail",</sub> | |
| 132 | `04-phase-cloud-identity-architecture.md:1667` ▶ | "cloudtrail:UpdateTrail", | |
| | | <sub>↑ "cloudtrail:DeleteTrail",<br>↓ "config:StopConfigurationRecorder",</sub> | |
| 133 | `04-phase-cloud-identity-architecture.md:1668` ▶ | "config:StopConfigurationRecorder", | |
| | | <sub>↑ "cloudtrail:UpdateTrail",<br>↓ "config:DeleteConfigurationRecorder",</sub> | |
| 134 | `04-phase-cloud-identity-architecture.md:1669` ▶ | "config:DeleteConfigurationRecorder", | |
| | | <sub>↑ "config:StopConfigurationRecorder",<br>↓ "config:DeleteDeliveryChannel"</sub> | |
| 135 | `04-phase-cloud-identity-architecture.md:1670` ▶ | "config:DeleteDeliveryChannel" | |
| | | <sub>↑ "config:DeleteConfigurationRecorder",<br>↓ ],</sub> | |
