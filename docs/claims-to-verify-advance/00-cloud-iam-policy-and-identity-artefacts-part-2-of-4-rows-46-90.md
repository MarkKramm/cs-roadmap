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

# Cloud IAM policy and identity artefacts — rows 46–90 of this class

This is part 2 of 4. **Verify only the rows below.** The other parts are separate messages and their rows are not repeated here.

| 46 | `04-phase-cloud-identity-architecture.md:534` | \| **Who can change it** \| Only the organisation's management account \| Anyone with `iam:PutRolePermissionsBoundary` on the role \| | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "PutRolePermissionsBoundary Grants permission to set a managed policy as a permissions boundary for a role" |
| 47 | `04-phase-cloud-identity-architecture.md:548` | \| “Developers must not create IAM users” \| A wiki page says so \| SCP denies `iam:CreateUser` in the workload OU \| — \| | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "CreateUser Grants permission to create a new IAM user"; SCPs attach to OUs per https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html — "AWS Organizations entities include organizational units, organizations, and accounts" |
| 48 | `04-phase-cloud-identity-architecture.md:551` | \| “Root user must not have access keys” \| An onboarding checklist \| SCP denies `iam:CreateAccessKey` for root \| Config rule with automatic remediation \| | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "CreateAccessKey Grants permission to create access key and secret access key for the specified IAM user" |
| 49 | `04-phase-cloud-identity-architecture.md:611` | The output of that pipeline is a list like `s3:GetObject`, `s3:PutObject`, `dynamodb:Query`, `kms:Decrypt`, `logs:CreateLogStream`. That list is the *observed* set, and it is the input to step three, not the answer. | **OK** — the derived `eventSource:eventName` output is real CloudTrail data and all five listed actions exist: https://docs.aws.amazon.com/service-authorization/latest/reference/list_kms.html — "Decrypt Controls permission to decrypt ciphertext that was encrypted under an AWS KMS key" |
| 50 | `04-phase-cloud-identity-architecture.md:623` ▶ | "s3:GetObject", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_s3.html — "GetObject Grants permission to retrieve objects from Amazon S3" |
| | | <sub>↑ "Action": [<br>↓ "s3:PutObject"</sub> | |
| 51 | `04-phase-cloud-identity-architecture.md:624` ▶ | "s3:PutObject" | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_s3.html — "PutObject Grants permission to add an object to a bucket" |
| | | <sub>↑ "s3:GetObject",<br>↓ ],</sub> | |
| 52 | `04-phase-cloud-identity-architecture.md:632` ▶ | "dynamodb:Query", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_dynamodb.html — "Query Grants permission to use the primary key of a table or a secondary index to directly access items from that table or index" |
| | | <sub>↑ "Action": [<br>↓ "dynamodb:GetItem",</sub> | |
| 53 | `04-phase-cloud-identity-architecture.md:633` ▶ | "dynamodb:GetItem", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_dynamodb.html — "GetItem Grants permission to return the attributes of one or more items from one or more tables" |
| | | <sub>↑ "dynamodb:Query",<br>↓ "dynamodb:PutItem"</sub> | |
| 54 | `04-phase-cloud-identity-architecture.md:634` ▶ | "dynamodb:PutItem" | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_dynamodb.html — "PutItem Grants permission to create a new item, or replace an old item with a new item" |
| | | <sub>↑ "dynamodb:GetItem",<br>↓ ],</sub> | |
| 55 | `04-phase-cloud-identity-architecture.md:641` ▶ | "Action": "kms:Decrypt", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_kms.html — "Decrypt Controls permission to decrypt ciphertext that was encrypted under an AWS KMS key" |
| | | <sub>↑ "Effect": "Allow",<br>↓ "Resource": "arn:aws:kms:ap-southeast-1:444455556666:key/6f1a2b3c-4d5e-6f70-8192-a3b4c5d6e7f8"</sub> | |
| 56 | `04-phase-cloud-identity-architecture.md:648` ▶ | "logs:CreateLogStream", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_logs.html — "CreateLogStream Grants permission to create a new log stream with the specified name" |
| | | <sub>↑ "Action": [<br>↓ "logs:PutLogEvents"</sub> | |
| 57 | `04-phase-cloud-identity-architecture.md:649` ▶ | "logs:PutLogEvents" | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_logs.html — "PutLogEvents Grants permission to upload a batch of log events to the specified log stream" |
| | | <sub>↑ "logs:CreateLogStream",<br>↓ ],</sub> | |
| 58 | `04-phase-cloud-identity-architecture.md:661` | \| Drop `s3:PutObject` if the workload only ever wrote during a migration \| Observation includes the migration; the steady state is narrower \| | **UNVERIFIABLE** — teaching judgement about when to narrow a grant; no source states when a workload "only ever wrote during a migration" |
| 59 | `04-phase-cloud-identity-architecture.md:662` | \| Scope the KMS grant to the specific key and add `kms:ViaService` \| Prevents the key being used from anywhere except S3, DynamoDB, or Lambda as intended \| | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_kms.html — "kms:ViaService Filters access when a request made on the principal's behalf comes from a specified AWS service"; note the value at line 676 pins S3 only, so a single value names one service rather than the S3/DynamoDB/Lambda set |
| 60 | `04-phase-cloud-identity-architecture.md:664` | \| Add a `Condition` on `aws:PrincipalArn` or a source VPC endpoint \| Makes the policy useless if the role's credentials are lifted and used from elsewhere \| | **UNVERIFIABLE** — design judgement about hardening, not a fact; note AWS documents at https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html that "For IAM roles, the request context returns the ARN of the role, not the ARN of the user that assumed the role", so pinning `aws:PrincipalArn` on the role's own identity-based policy cannot by itself constrain where lifted credentials are used |
| 61 | `04-phase-cloud-identity-architecture.md:672` ▶ | "Action": "kms:Decrypt", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_kms.html — "Decrypt Controls permission to decrypt ciphertext that was encrypted under an AWS KMS key" |
| | | <sub>↑ "Effect": "Allow",<br>↓ "Resource": "arn:aws:kms:ap-southeast-1:444455556666:key/6f1a2b3c-4d5e-6f70-8192-a3b4c5d6e7f8",</sub> | |
| 62 | `04-phase-cloud-identity-architecture.md:676` ▶ | "kms:ViaService": "s3.ap-southeast-1.amazonaws.com" | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_kms.html — "kms:ViaService Filters access when a request made on the principal's behalf comes from a specified AWS service"; the operator is real per https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition_operators.html — "StringEquals Exact matching, case sensitive" |
| | | <sub>↑ "StringEquals": {<br>↓ }</sub> | |
| 63 | `04-phase-cloud-identity-architecture.md:720` ▶ | "Action": "sts:AssumeRole", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_sts.html — "AssumeRole Grants permission to obtain a set of temporary security credentials that you can use to access AWS resources" |
| | | <sub>↑ },<br>↓ "Condition": {</sub> | |
| 64 | `04-phase-cloud-identity-architecture.md:723` ▶ | "sts:ExternalId": "c1f4b0a7-2d8e-4a3f-9b21-6a0e5d7c4f88" | **OK** — vendor documentation (IAM User Guide), https://docs.aws.amazon.com/IAM/latest/UserGuide/confused-deputy.html — the doc's own example is "Condition": { "StringEquals": { "sts:ExternalId": "12345" } } on an sts:AssumeRole trust policy, and "The primary function of the external ID is to address and prevent the confused deputy problem" |
| | | <sub>↑ "StringEquals": {<br>↓ }</sub> | |
| 65 | `04-phase-cloud-identity-architecture.md:745` ▶ | "Action": "sts:AssumeRoleWithSAML", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_sts.html — "AssumeRoleWithSAML Grants permission to obtain a set of temporary security credentials for users who have been authenticated via a SAML authentication response" |
| | | <sub>↑ },<br>↓ "Condition": {</sub> | |
| 66 | `04-phase-cloud-identity-architecture.md:764` | **`aws:MultiFactorAuthPresent`** is a condition key that is true when the credentials used to make the request were obtained with multi-factor authentication. Putting it in a trust policy is a standard hardening step, and it has a failure mode that has confuse … | **OK** — vendor documentation (AWS global condition context keys), https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html — "Use this key to check whether multi-factor authentication (MFA) was used to validate the temporary security credentials that made the request" |
| 67 | `04-phase-cloud-identity-architecture.md:766` | > **Common failure:** A trust policy requires `aws:MultiFactorAuthPresent: true`. It works when a human signs in and assumes the role directly. Then someone builds a pipeline that assumes a role, then assumes this role from that session — **role chaining** — a … | **OK** — vendor documentation (IAM User Guide, Secure API access with MFA), https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa_configure-api-require.html — "The temporary credentials returned by AssumeRole do not include MFA information in the context, so you cannot check individual API operations for MFA" |
| 68 | `04-phase-cloud-identity-architecture.md:775` | \| Add `sts:SetSourceIdentity` and require `sts:SourceIdentity` \| The originating identity is carried into CloudTrail, so the chain is auditable \| Almost always — this is the correct hardening \| | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_sts.html — "SetSourceIdentity Grants permission to set a source identity on an STS session"; and https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html — "Activity for the role's specified source identity appears in AWS CloudTrail" |
| 69 | `04-phase-cloud-identity-architecture.md:782` | **Which roles those are is the part worth getting right, because the key above does not mean what it looks like it means here.** `aws:MultiFactorAuthPresent` describes whether *the AWS credentials making the call* were obtained with MFA. | **OK** — vendor documentation (AWS global condition context keys), https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html — "Use this key to check whether multi-factor authentication (MFA) was used to validate the temporary security credentials that made the request" |
| 70 | `04-phase-cloud-identity-architecture.md:784` | A role assumed through `sts:AssumeRoleWithSAML` is handed its credentials by the identity provider's assertion. The MFA that actually happened took place at the identity provider, before the assertion was ever signed, and it is not visible to these condition k … | **OK** — vendor documentation (AWS global condition context keys), https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html — "This condition key is not present for federated identities or requests made using access keys to sign AWS CLI, AWS API, or AWS SDK requests" |
| 71 | `04-phase-cloud-identity-architecture.md:786` | So a trust policy for a federated role that requires `aws:MultiFactorAuthPresent: true` does not enforce fresh MFA. It denies the assumption, every time, including for the person who did present MFA. The `sts:AssumeRole` path — where a human authenticates to A … | **OK** — vendor documentation (AWS global condition context keys), https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html — "This condition key is not present for federated identities"; with https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition.html — "A context key that is not present in the request is considered a mismatch", the Allow fails and the assumption is denied |
| 72 | `04-phase-cloud-identity-architecture.md:797` ▶ | "Action": "sts:AssumeRole", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_sts.html — "AssumeRole Grants permission to obtain a set of temporary security credentials that you can use to access AWS resources" |
| | | <sub>↑ },<br>↓ "Condition": {</sub> | |
| 73 | `04-phase-cloud-identity-architecture.md:800` ▶ | "aws:MultiFactorAuthPresent": "true" | **OK** — vendor documentation (IAM User Guide, Secure API access with MFA), https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa_configure-api-require.html — AWS's own trust-policy example is "Condition": {"Bool": {"aws:MultiFactorAuthPresent": "true"}} on sts:AssumeRole |
| | | <sub>↑ "Bool": {<br>↓ },</sub> | |
| 74 | `04-phase-cloud-identity-architecture.md:803` ▶ | "aws:MultiFactorAuthAge": "900" | **OK** — vendor documentation (IAM condition operators), https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition_operators.html — "NumericLessThan 'Less than' matching"; https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html — `aws:MultiFactorAuthAge` is in seconds, so 900 is fifteen minutes |
| | | <sub>↑ "NumericLessThan": {<br>↓ }</sub> | |
| 75 | `04-phase-cloud-identity-architecture.md:812` | **The federated version is enforced on the other side of the boundary.** For `sts:AssumeRoleWithSAML`, fresh MFA belongs in the identity provider's policy — a Conditional Access rule requiring an authentication strength for the group assigned to that role. | **OK** — vendor documentation (AWS global condition context keys), https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html — "This condition key is not present for federated identities" and "To check whether MFA is used to validate IAM federated identities, you can pass the authentication method from your identity provider to AWS as a session tag"; the Entra Conditional Access specifics are identity-provider guidance, not AWS reference |
| 76 | `04-phase-cloud-identity-architecture.md:814` | What the AWS trust policy can usefully constrain is the assertion itself: `SAML:aud` to pin the audience, `SAML:sub` to pin who may assert it, and `sts:SourceIdentity` with `sts:SetSourceIdentity` so the originating human survives into CloudTrail. | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_sts.html — "saml:aud Filters access by the endpoint URL to which SAML assertions are presented" and "saml:sub Filters access by the subject of the claim (the SAML user ID)", both listed for AssumeRoleWithSAML |
| 77 | `04-phase-cloud-identity-architecture.md:818` | `aws:MultiFactorAuthAge` is measured in seconds, so on the roles it *does* apply to, `900` means the MFA had to happen within the last fifteen minutes. That is the setting that turns MFA from “you have it” into “you used it, recently, for this.” | **OK** — vendor documentation (AWS global condition context keys), https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html — "Use this key to compare the number of seconds since the requesting principal was authorized using MFA with the number that you specify in the policy", so 900 seconds is fifteen minutes |
| 78 | `04-phase-cloud-identity-architecture.md:909` ▶ | "Action": "sts:AssumeRoleWithWebIdentity", | **OK** — vendor documentation (AWS STS and OIDC condition keys), https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_iam-condition-keys.html — AWS's own example is sts:AssumeRoleWithWebIdentity with "StringEquals": { "token.actions.githubusercontent.com:aud": "sts.amazonaws.com", "token.actions.githubusercontent.com:sub": "repo:org-name/repo-name:ref:refs/heads/demo" } |
| | | <sub>↑ },<br>↓ "Condition": {</sub> | |
| 79 | `04-phase-cloud-identity-architecture.md:956` ▶ | Action = "sts:AssumeRoleWithWebIdentity" | **OK** — vendor documentation (AWS STS and OIDC condition keys), https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_iam-condition-keys.html — the action and both condition keys match AWS's documented example exactly; the `Action = ` form is HCL inside Terraform `jsonencode` |
| | | <sub>↑ }<br>↓ Condition = {</sub> | |
| 80 | `04-phase-cloud-identity-architecture.md:1024` ▶ | "Action": "sts:AssumeRoleWithWebIdentity", | **OK** — vendor documentation (AWS STS and OIDC condition keys), https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_iam-condition-keys.html — sts:AssumeRoleWithWebIdentity with "StringEquals": { "token.actions.githubusercontent.com:aud": "sts.amazonaws.com", "token.actions.githubusercontent.com:sub": "system:serviceaccount:payments:payments-api" }; the key form is documented, the EKS-style `sub` value is a worked example |
| | | <sub>↑ },<br>↓ "Condition": {</sub> | |
| 81 | `04-phase-cloud-identity-architecture.md:1100` ▶ | "kms:Create*", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_kms.html — `kms:Create*` resolves to 4 real actions: CreateAlias, CreateCustomKeyStore, CreateGrant, CreateKey |
| | | <sub>↑ "Action": [<br>↓ "kms:Describe*",</sub> | |
| 82 | `04-phase-cloud-identity-architecture.md:1101` ▶ | "kms:Describe*", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_kms.html — `kms:Describe*` resolves to 2 real actions: DescribeCustomKeyStores, DescribeKey |
| | | <sub>↑ "kms:Create*",<br>↓ "kms:Enable*",</sub> | |
| 83 | `04-phase-cloud-identity-architecture.md:1102` ▶ | "kms:Enable*", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_kms.html — `kms:Enable*` resolves to 2 real actions: EnableKey, EnableKeyRotation |
| | | <sub>↑ "kms:Describe*",<br>↓ "kms:List*",</sub> | |
| 84 | `04-phase-cloud-identity-architecture.md:1103` ▶ | "kms:List*", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_kms.html — `kms:List*` resolves to 7 real actions: ListAliases, ListGrants, ListKeyPolicies, ListKeyRotations, ListKeys, ListResourceTags, ListRetirableGrants |
| | | <sub>↑ "kms:Enable*",<br>↓ "kms:Put*",</sub> | |
| 85 | `04-phase-cloud-identity-architecture.md:1104` ▶ | "kms:Put*", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_kms.html — `kms:Put*` resolves to 1 real action: PutKeyPolicy |
| | | <sub>↑ "kms:List*",<br>↓ "kms:Update*",</sub> | |
| 86 | `04-phase-cloud-identity-architecture.md:1105` ▶ | "kms:Update*", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_kms.html — `kms:Update*` resolves to 4 real actions including UpdateAlias, UpdateCustomKeyStore, UpdateKeyDescription |
| | | <sub>↑ "kms:Put*",<br>↓ "kms:Revoke*",</sub> | |
| 87 | `04-phase-cloud-identity-architecture.md:1106` ▶ | "kms:Revoke*", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_kms.html — `kms:Revoke*` resolves to 1 real action: RevokeGrant |
| | | <sub>↑ "kms:Update*",<br>↓ "kms:Disable*",</sub> | |
| 88 | `04-phase-cloud-identity-architecture.md:1107` ▶ | "kms:Disable*", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_kms.html — `kms:Disable*` resolves to 2 real actions: DisableKey, DisableKeyRotation |
| | | <sub>↑ "kms:Revoke*",<br>↓ "kms:Get*",</sub> | |
| 89 | `04-phase-cloud-identity-architecture.md:1108` ▶ | "kms:Get*", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_kms.html — `kms:Get*` resolves to 5 real actions including GetKeyLastUsage, GetKeyPolicy, GetKeyRotationStatus |
| | | <sub>↑ "kms:Disable*",<br>↓ "kms:TagResource",</sub> | |
| 90 | `04-phase-cloud-identity-architecture.md:1109` ▶ | "kms:TagResource", | **OK** — vendor reference (AWS Service Authorization Reference), https://docs.aws.amazon.com/service-authorization/latest/reference/list_kms.html — "TagResource Controls permission to create or update tags that are attached to an AWS KMS key" |
| | | <sub>↑ "kms:Get*",<br>↓ "kms:UntagResource",</sub> | |
