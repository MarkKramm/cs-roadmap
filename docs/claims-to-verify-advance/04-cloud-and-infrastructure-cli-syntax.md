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

# Cloud and infrastructure CLI syntax

| 1 | `04-phase-cloud-identity-architecture.md:241` ▶ | az account management-group create --name "contoso" --display-name "Contoso" | |
| | | <sub>↑ # A four-level management group hierarchy.<br>↓ az account management-group create --name "contoso-platform" --display-name "Platform" --parent "contoso"</sub> | |
| 2 | `04-phase-cloud-identity-architecture.md:242` ▶ | az account management-group create --name "contoso-platform" --display-name "Platform" --parent "contoso" | |
| | | <sub>↑ az account management-group create --name "contoso" --display-name "Contoso"<br>↓ az account management-group create --name "contoso-landing-zones" --display-name "Landing Zones" --parent "contoso"</sub> | |
| 3 | `04-phase-cloud-identity-architecture.md:243` ▶ | az account management-group create --name "contoso-landing-zones" --display-name "Landing Zones" --parent "contoso" | |
| 4 | `04-phase-cloud-identity-architecture.md:244` ▶ | az account management-group create --name "contoso-corp" --display-name "Corp" --parent "contoso-landing-zones" | |
| 5 | `04-phase-cloud-identity-architecture.md:245` ▶ | az account management-group create --name "contoso-online" --display-name "Online" --parent "contoso-landing-zones" | |
| 6 | `04-phase-cloud-identity-architecture.md:246` ▶ | az account management-group create --name "contoso-sandbox" --display-name "Sandbox" --parent "contoso" | |
| | | <sub>↑ az account management-group create --name "contoso-online" --display-name "Online" --parent "contoso-landing-zones"</sub> | |
| 7 | `04-phase-cloud-identity-architecture.md:250` ▶ | az account management-group subscription add \ --name "contoso-corp" \ --subscription "00000000-1111-2222-3333-444444444444" | |
| 8 | `04-phase-cloud-identity-architecture.md:353` ▶ | aws organizations create-policy \ --name DenyRootUserExceptAllowlisted \ --description "Confine the root user and protect the audit trail" \ --type SERVICE_CONTROL_POLICY \ --content file://scp-root-lockdown.json | |
| 9 | `04-phase-cloud-identity-architecture.md:359` ▶ | aws organizations attach-policy \ --policy-id p-9klmnopqrs \ --target-id ou-abcd-11111111 | |
| | | <sub>↓ ```</sub> | |
| 10 | `04-phase-cloud-identity-architecture.md:482` ▶ | aws iam create-policy \ --policy-name OrgDeveloperBoundary \ --description "Maximum permissions any developer role may hold" \ --policy-document file://boundary-developer.json | |
| 11 | `04-phase-cloud-identity-architecture.md:487` ▶ | aws iam put-role-permissions-boundary \ --role-name DeveloperRole \ --permissions-boundary arn:aws:iam::444455556666:policy/OrgDeveloperBoundary | |
| 12 | `04-phase-cloud-identity-architecture.md:582` ▶ | aws accessanalyzer start-policy-generation \ --policy-generation-details '{ | |
| | | <sub>↑ # Generate a candidate policy from 90 days of CloudTrail activity for a role.<br>↓ "principalArn": "arn:aws:iam::444455556666:role/PaymentsApiTaskRole",</sub> | |
| 13 | `04-phase-cloud-identity-architecture.md:594` ▶ | aws accessanalyzer get-generated-policy --job-id <job-id> | |
| | | <sub>↑ # Poll for the job, then retrieve the generated policy.<br>↓ ```</sub> | |
| 14 | `04-phase-cloud-identity-architecture.md:601` ▶ | aws cloudtrail lookup-events \ --lookup-attributes AttributeKey=Username,AttributeValue=PaymentsApiTaskRole \ --start-time 2025-12-14T00:00:00Z \ --end-time 2026-03-14T00:00:00Z \ --query 'Events[].CloudTrailEvent' \ --output text \ \| jq -r 'fromjson \| "\(.e … | |
| 15 | `04-phase-cloud-identity-architecture.md:826` ▶ | aws sts assume-role \ --role-arn arn:aws:iam::222233334444:role/OrgAuditReadOnly \ --role-session-name audit-2026-03-14 \ --external-id c1f4b0a7-2d8e-4a3f-9b21-6a0e5d7c4f88 \ --duration-seconds 3600 | |
| 16 | `04-phase-cloud-identity-architecture.md:850` ▶ | aws sts get-caller-identity --query 'Arn' --output text | |
| | | <sub>↑ # Who am I, and through which path did I get here?<br>↓ ```</sub> | |
| 17 | `04-phase-cloud-identity-architecture.md:859` ▶ | az account show --query '{user:user.name, tenant:tenantId, subscription:name}' --output json | |
| | | <sub>↑ # Who am I signed in as, and against which subscription?</sub> | |
| 18 | `04-phase-cloud-identity-architecture.md:862` ▶ | az role assignment list \ --scope "/subscriptions/00000000-1111-2222-3333-444444444444" \ --include-inherited \ --query '[].{principal:principalName, type:principalType, role:roleDefinitionName, scope:scope}' \ --output table | |
| 19 | `04-phase-cloud-identity-architecture.md:976` ▶ | az identity create \ --name "id-payments-api" \ --resource-group "rg-payments-prod" | |
| | | <sub>↑ # Create a user-assigned managed identity for the workload.</sub> | |
| 20 | `04-phase-cloud-identity-architecture.md:981` ▶ | az identity federated-credential create \ --name "github-main" \ --identity-name "id-payments-api" \ --resource-group "rg-payments-prod" \ --issuer "https://token.actions.githubusercontent.com" \ --subject "repo:acme/payments-api:ref:refs/heads/main" \ --audie … | |
| 21 | `04-phase-cloud-identity-architecture.md:990` ▶ | az role assignment create \ --assignee-object-id "$(az identity show --name id-payments-api \ --resource-group rg-payments-prod --query principalId --output tsv)" \ --assignee-principal-type ServicePrincipal \ --role "Key Vault Secrets User" \ --scope "/subscr … | |
| 22 | `04-phase-cloud-identity-architecture.md:1006` | \| A secret containing a static cloud key \| Mounted into the pod as an environment variable or file \| The key is now in etcd, in any backup, and in anyone's `kubectl describe` output \| | |
| 23 | `04-phase-cloud-identity-architecture.md:1056` ▶ | az keyvault create \ --name "kv-payments-prod" \ --resource-group "rg-payments-prod" \ --location "southeastasia" \ --enable-rbac-authorization true \ --enable-purge-protection true \ --retention-days 90 | |
| 24 | `04-phase-cloud-identity-architecture.md:1065` ▶ | az role assignment create \ --assignee-object-id "$(az identity show --name id-payments-api \ --resource-group rg-payments-prod --query principalId --output tsv)" \ --assignee-principal-type ServicePrincipal \ --role "Key Vault Secrets User" \ --scope "/subscr … | |
| 25 | `04-phase-cloud-identity-architecture.md:1190` ▶ | terraform plan -out=tfplan.binary | |
| | | <sub>↑ # 1. Produce a plan.</sub> | |
| 26 | `04-phase-cloud-identity-architecture.md:1193` ▶ | terraform show -json tfplan.binary > tfplan.json | |
| | | <sub>↑ # 2. Convert it to JSON, which is the format policy engines consume.</sub> | |
| 27 | `04-phase-cloud-identity-architecture.md:1196` ▶ | conftest test --policy policy/ tfplan.json | |
| | | <sub>↑ # 3. Evaluate the policies against the plan.</sub> | |
| 28 | `04-phase-cloud-identity-architecture.md:1199` ▶ | opa eval --data policy/ --input tfplan.json "data.terraform.aws.deny" | |
| | | <sub>↑ # 4. Or run OPA directly if you prefer not to use the conftest wrapper.<br>↓ ```</sub> | |
| 29 | `04-phase-cloud-identity-architecture.md:1311` ▶ | az policy definition create \ --name "deny-public-ip-on-nics" \ --display-name "Deny public IP addresses on network interfaces" \ --rules @policy-rule-deny-public-ip.json \ --mode All | |
| 30 | `04-phase-cloud-identity-architecture.md:1318` ▶ | az policy assignment create \ --name "audit-public-ip" \ --policy "deny-public-ip-on-nics" \ --scope "/providers/Microsoft.Management/managementGroups/contoso-corp" \ --enforcement-mode DoNotEnforce | |
| 31 | `04-phase-cloud-identity-architecture.md:1325` ▶ | az policy assignment update \ --name "audit-public-ip" \ --scope "/providers/Microsoft.Management/managementGroups/contoso-corp" \ --enforcement-mode Default | |
| 32 | `04-phase-cloud-identity-architecture.md:1494` ▶ | aws cloudtrail lookup-events \ --lookup-attributes AttributeKey=EventName,AttributeValue=AssumeRole \ --start-time 2025-12-14T00:00:00Z \ --query 'Events[].CloudTrailEvent' \ --output text \ \| jq -r 'fromjson | |
| 33 | `04-phase-cloud-identity-architecture.md:1819` ▶ | aws ec2 describe-instances --region ap-southeast-1 --max-items 1 >/dev/null && echo "ec2: allowed as expected" | |
| 34 | `04-phase-cloud-identity-architecture.md:1822` ▶ | aws iam create-access-key --user-name some-existing-user | |
| | | <sub>↑ # 2. As the platform admin role, attempt the thing the boundary denies.<br>↓ # Expected: AccessDenied. If it succeeds, the boundary is not attached to this role.</sub> | |
| 35 | `04-phase-cloud-identity-architecture.md:1827` ▶ | aws sts get-caller-identity --query 'Arn' --output text | |
| | | <sub>↑ # number of "the boundary is broken" reports are "I am not that role".<br>↓ ```</sub> | |
