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

# Cloud IAM policy and identity artefacts — rows 136–139 of this class

This is part 4 of 4. **Verify only the rows below.** The other parts are separate messages and their rows are not repeated here.

| 136 | `04-phase-cloud-identity-architecture.md:1708` ▶ | Action = "sts:AssumeRoleWithSAML" | **OK** — vendor reference documentation, https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_saml.html — `"Principal": {"Federated": "arn:aws:iam::{{111122223333}}:saml-provider/ExampleOrgSSOProvider"}, "Action": "sts:AssumeRoleWithSAML"`. The action is also listed in the Service Authorization Reference (https://docs.aws.amazon.com/service-authorization/latest/reference/list_awssts.html — "AssumeRoleWithSAML Grants permission to obtain a set of temporary security credentials for users who have been authenticated via a SAML authentication response"). The adjacent `SAML:aud` value is correct too: AWS documents `"saml:aud": "https://{{us-east-1}}.signin.aws.amazon.com/saml"` and says the `region-code` is optional, so the global form `https://signin.aws.amazon.com/saml` in the phase file is a documented value. |
| | | <sub>↑ }<br>↓ Condition = {</sub> | |
| 137 | `04-phase-cloud-identity-architecture.md:1763` ▶ | Action = "sts:AssumeRoleWithSAML" | **OK** — vendor reference documentation, https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_saml.html — `"Principal": {"Federated": "arn:aws:iam::{{111122223333}}:saml-provider/ExampleOrgSSOProvider"}, "Action": "sts:AssumeRoleWithSAML"`. Same action, same `Federated` principal type, same documented `saml:aud` global-endpoint value as rows 101 and 136. One observation about the phase text, not the row: the `Sid` here is `BreakGlassAssumeRequiresFreshMFA` (:1758) but the only condition is `SAML:aud` — there is no MFA condition key in the block. |
| | | <sub>↑ }<br>↓ Condition = {</sub> | |
| 138 | `04-phase-cloud-identity-architecture.md:1830` | **Write the result of the second command into the design document, with the date.** That record — “on 14 March 2026, `iam:CreateAccessKey` was denied for the `PlatformAdmin` role” — is the evidence that the control is enforced rather than intended, and it is t … | **OK** — AWS Service Authorization Reference (IAM, service prefix: `iam`), https://docs.aws.amazon.com/service-authorization/latest/reference/list_iam.html — "CreateAccessKey … Grants permission to create access key and secret access key for the specified IAM user". The mapping is right: the second command in the block at :1822 is `aws iam create-access-key`, and the boundary's fourth statement does list `"iam:CreateAccessKey"` in its `Deny` (:1651), so `AccessDenied` is the expected result. The rest of the row is a worked example and a teaching point about evidence, not a fact about AWS. |
| 139 | `04-phase-cloud-identity-architecture.md:1891` | - **The MFA context does not survive role chaining.** `aws:MultiFactorAuthPresent` is false on the second assumption, which is why workload identity beats a chain. | **OK** — vendor reference documentation, https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa_configure-api-require.html — "The temporary credentials returned by AssumeRole do not include MFA information in the context, so you cannot check individual API operations for MFA." Since the second assumption is made with exactly those credentials, no MFA information reaches that request, so `aws:MultiFactorAuthPresent` cannot be true. Two precision notes: AWS words it as the key being absent rather than "false" (an absent key makes a `Bool` condition false but makes `BoolIfExists` *pass*), and MFA is only ever evaluated at assumption time — "the MFA authentication is used only to determine whether a user can assume the role". The clause "which is why workload identity beats a chain" is a design judgement, not an AWS claim. |
