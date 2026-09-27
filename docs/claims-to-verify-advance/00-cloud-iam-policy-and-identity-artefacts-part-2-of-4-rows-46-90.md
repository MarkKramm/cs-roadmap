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

# Cloud IAM policy and identity artefacts — rows 46–90 of this class

This is part 2 of 4. **Verify only the rows below.** The other parts are separate messages and their rows are not repeated here.

| 46 | `04-phase-cloud-identity-architecture.md:534` | \| **Who can change it** \| Only the organisation's management account \| Anyone with `iam:PutRolePermissionsBoundary` on the role \| | |
| 47 | `04-phase-cloud-identity-architecture.md:548` | \| “Developers must not create IAM users” \| A wiki page says so \| SCP denies `iam:CreateUser` in the workload OU \| — \| | |
| 48 | `04-phase-cloud-identity-architecture.md:551` | \| “Root user must not have access keys” \| An onboarding checklist \| SCP denies `iam:CreateAccessKey` for root \| Config rule with automatic remediation \| | |
| 49 | `04-phase-cloud-identity-architecture.md:611` | The output of that pipeline is a list like `s3:GetObject`, `s3:PutObject`, `dynamodb:Query`, `kms:Decrypt`, `logs:CreateLogStream`. That list is the *observed* set, and it is the input to step three, not the answer. | |
| 50 | `04-phase-cloud-identity-architecture.md:623` ▶ | "s3:GetObject", | |
| | | <sub>↑ "Action": [<br>↓ "s3:PutObject"</sub> | |
| 51 | `04-phase-cloud-identity-architecture.md:624` ▶ | "s3:PutObject" | |
| | | <sub>↑ "s3:GetObject",<br>↓ ],</sub> | |
| 52 | `04-phase-cloud-identity-architecture.md:632` ▶ | "dynamodb:Query", | |
| | | <sub>↑ "Action": [<br>↓ "dynamodb:GetItem",</sub> | |
| 53 | `04-phase-cloud-identity-architecture.md:633` ▶ | "dynamodb:GetItem", | |
| | | <sub>↑ "dynamodb:Query",<br>↓ "dynamodb:PutItem"</sub> | |
| 54 | `04-phase-cloud-identity-architecture.md:634` ▶ | "dynamodb:PutItem" | |
| | | <sub>↑ "dynamodb:GetItem",<br>↓ ],</sub> | |
| 55 | `04-phase-cloud-identity-architecture.md:641` ▶ | "Action": "kms:Decrypt", | |
| | | <sub>↑ "Effect": "Allow",<br>↓ "Resource": "arn:aws:kms:ap-southeast-1:444455556666:key/6f1a2b3c-4d5e-6f70-8192-a3b4c5d6e7f8"</sub> | |
| 56 | `04-phase-cloud-identity-architecture.md:648` ▶ | "logs:CreateLogStream", | |
| | | <sub>↑ "Action": [<br>↓ "logs:PutLogEvents"</sub> | |
| 57 | `04-phase-cloud-identity-architecture.md:649` ▶ | "logs:PutLogEvents" | |
| | | <sub>↑ "logs:CreateLogStream",<br>↓ ],</sub> | |
| 58 | `04-phase-cloud-identity-architecture.md:661` | \| Drop `s3:PutObject` if the workload only ever wrote during a migration \| Observation includes the migration; the steady state is narrower \| | |
| 59 | `04-phase-cloud-identity-architecture.md:662` | \| Scope the KMS grant to the specific key and add `kms:ViaService` \| Prevents the key being used from anywhere except S3, DynamoDB, or Lambda as intended \| | |
| 60 | `04-phase-cloud-identity-architecture.md:664` | \| Add a `Condition` on `aws:PrincipalArn` or a source VPC endpoint \| Makes the policy useless if the role's credentials are lifted and used from elsewhere \| | |
| 61 | `04-phase-cloud-identity-architecture.md:672` ▶ | "Action": "kms:Decrypt", | |
| | | <sub>↑ "Effect": "Allow",<br>↓ "Resource": "arn:aws:kms:ap-southeast-1:444455556666:key/6f1a2b3c-4d5e-6f70-8192-a3b4c5d6e7f8",</sub> | |
| 62 | `04-phase-cloud-identity-architecture.md:676` ▶ | "kms:ViaService": "s3.ap-southeast-1.amazonaws.com" | |
| | | <sub>↑ "StringEquals": {<br>↓ }</sub> | |
| 63 | `04-phase-cloud-identity-architecture.md:720` ▶ | "Action": "sts:AssumeRole", | |
| | | <sub>↑ },<br>↓ "Condition": {</sub> | |
| 64 | `04-phase-cloud-identity-architecture.md:723` ▶ | "sts:ExternalId": "c1f4b0a7-2d8e-4a3f-9b21-6a0e5d7c4f88" | |
| | | <sub>↑ "StringEquals": {<br>↓ }</sub> | |
| 65 | `04-phase-cloud-identity-architecture.md:745` ▶ | "Action": "sts:AssumeRoleWithSAML", | |
| | | <sub>↑ },<br>↓ "Condition": {</sub> | |
| 66 | `04-phase-cloud-identity-architecture.md:764` | **`aws:MultiFactorAuthPresent`** is a condition key that is true when the credentials used to make the request were obtained with multi-factor authentication. Putting it in a trust policy is a standard hardening step, and it has a failure mode that has confuse … | |
| 67 | `04-phase-cloud-identity-architecture.md:766` | > **Common failure:** A trust policy requires `aws:MultiFactorAuthPresent: true`. It works when a human signs in and assumes the role directly. Then someone builds a pipeline that assumes a role, then assumes this role from that session — **role chaining** — a … | |
| 68 | `04-phase-cloud-identity-architecture.md:775` | \| Add `sts:SetSourceIdentity` and require `sts:SourceIdentity` \| The originating identity is carried into CloudTrail, so the chain is auditable \| Almost always — this is the correct hardening \| | |
| 69 | `04-phase-cloud-identity-architecture.md:782` | **Which roles those are is the part worth getting right, because the key above does not mean what it looks like it means here.** `aws:MultiFactorAuthPresent` describes whether *the AWS credentials making the call* were obtained with MFA. | |
| 70 | `04-phase-cloud-identity-architecture.md:784` | A role assumed through `sts:AssumeRoleWithSAML` is handed its credentials by the identity provider's assertion. The MFA that actually happened took place at the identity provider, before the assertion was ever signed, and it is not visible to these condition k … | |
| 71 | `04-phase-cloud-identity-architecture.md:786` | So a trust policy for a federated role that requires `aws:MultiFactorAuthPresent: true` does not enforce fresh MFA. It denies the assumption, every time, including for the person who did present MFA. The `sts:AssumeRole` path — where a human authenticates to A … | |
| 72 | `04-phase-cloud-identity-architecture.md:797` ▶ | "Action": "sts:AssumeRole", | |
| | | <sub>↑ },<br>↓ "Condition": {</sub> | |
| 73 | `04-phase-cloud-identity-architecture.md:800` ▶ | "aws:MultiFactorAuthPresent": "true" | |
| | | <sub>↑ "Bool": {<br>↓ },</sub> | |
| 74 | `04-phase-cloud-identity-architecture.md:803` ▶ | "aws:MultiFactorAuthAge": "900" | |
| | | <sub>↑ "NumericLessThan": {<br>↓ }</sub> | |
| 75 | `04-phase-cloud-identity-architecture.md:812` | **The federated version is enforced on the other side of the boundary.** For `sts:AssumeRoleWithSAML`, fresh MFA belongs in the identity provider's policy — a Conditional Access rule requiring an authentication strength for the group assigned to that role. | |
| 76 | `04-phase-cloud-identity-architecture.md:814` | What the AWS trust policy can usefully constrain is the assertion itself: `SAML:aud` to pin the audience, `SAML:sub` to pin who may assert it, and `sts:SourceIdentity` with `sts:SetSourceIdentity` so the originating human survives into CloudTrail. | |
| 77 | `04-phase-cloud-identity-architecture.md:818` | `aws:MultiFactorAuthAge` is measured in seconds, so on the roles it *does* apply to, `900` means the MFA had to happen within the last fifteen minutes. That is the setting that turns MFA from “you have it” into “you used it, recently, for this.” | |
| 78 | `04-phase-cloud-identity-architecture.md:909` ▶ | "Action": "sts:AssumeRoleWithWebIdentity", | |
| | | <sub>↑ },<br>↓ "Condition": {</sub> | |
| 79 | `04-phase-cloud-identity-architecture.md:956` ▶ | Action = "sts:AssumeRoleWithWebIdentity" | |
| | | <sub>↑ }<br>↓ Condition = {</sub> | |
| 80 | `04-phase-cloud-identity-architecture.md:1024` ▶ | "Action": "sts:AssumeRoleWithWebIdentity", | |
| | | <sub>↑ },<br>↓ "Condition": {</sub> | |
| 81 | `04-phase-cloud-identity-architecture.md:1100` ▶ | "kms:Create*", | |
| | | <sub>↑ "Action": [<br>↓ "kms:Describe*",</sub> | |
| 82 | `04-phase-cloud-identity-architecture.md:1101` ▶ | "kms:Describe*", | |
| | | <sub>↑ "kms:Create*",<br>↓ "kms:Enable*",</sub> | |
| 83 | `04-phase-cloud-identity-architecture.md:1102` ▶ | "kms:Enable*", | |
| | | <sub>↑ "kms:Describe*",<br>↓ "kms:List*",</sub> | |
| 84 | `04-phase-cloud-identity-architecture.md:1103` ▶ | "kms:List*", | |
| | | <sub>↑ "kms:Enable*",<br>↓ "kms:Put*",</sub> | |
| 85 | `04-phase-cloud-identity-architecture.md:1104` ▶ | "kms:Put*", | |
| | | <sub>↑ "kms:List*",<br>↓ "kms:Update*",</sub> | |
| 86 | `04-phase-cloud-identity-architecture.md:1105` ▶ | "kms:Update*", | |
| | | <sub>↑ "kms:Put*",<br>↓ "kms:Revoke*",</sub> | |
| 87 | `04-phase-cloud-identity-architecture.md:1106` ▶ | "kms:Revoke*", | |
| | | <sub>↑ "kms:Update*",<br>↓ "kms:Disable*",</sub> | |
| 88 | `04-phase-cloud-identity-architecture.md:1107` ▶ | "kms:Disable*", | |
| | | <sub>↑ "kms:Revoke*",<br>↓ "kms:Get*",</sub> | |
| 89 | `04-phase-cloud-identity-architecture.md:1108` ▶ | "kms:Get*", | |
| | | <sub>↑ "kms:Disable*",<br>↓ "kms:TagResource",</sub> | |
| 90 | `04-phase-cloud-identity-architecture.md:1109` ▶ | "kms:TagResource", | |
| | | <sub>↑ "kms:Get*",<br>↓ "kms:UntagResource",</sub> | |
