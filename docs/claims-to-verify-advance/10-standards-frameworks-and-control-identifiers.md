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

# Standards, frameworks and control identifiers

| 1 | `03-phase-incident-command.md:972` | - NIST SP 800-61 Rev. 3, Incident Response Recommendations and Considerations for Cybersecurity Risk Management — https://csrc.nist.gov/pubs/sp/800/61/r3/final | |
| 2 | `03-phase-incident-command.md:1153` | Every practice in this phase runs at $0. A Jitsi room is a bridge call, HedgeDoc or Etherpad is a scribe's log, and a shared document is a decision log; none of that changes the skill being built. The authoritative material is free as well: FEMA's ICS courses  … | |
| 3 | `04-phase-cloud-identity-architecture.md:1957` | - NIST SP 800-207, Zero Trust Architecture — https://csrc.nist.gov/pubs/sp/800/207/final | |
| | | <sub>↑ - Terraform AWS provider documentation — https://registry.terraform.io/providers/hashicorp/aws/latest/docs<br>↓ - CIS Benchmarks — https://www.cisecurity.org/cis-benchmarks</sub> | |
| 4 | `04-phase-cloud-identity-architecture.md:1958` | - CIS Benchmarks — https://www.cisecurity.org/cis-benchmarks | |
| | | <sub>↑ - NIST SP 800-207, Zero Trust Architecture — https://csrc.nist.gov/pubs/sp/800/207/final<br>↓ - Cloud Security Alliance Cloud Controls Matrix — https://cloudsecurityalliance.org/research/cloud-controls-matrix</sub> | |
| 5 | `04-phase-cloud-identity-architecture.md:1960` | - NIST SP 800-63C Rev. 4, Federation and Assertions — https://csrc.nist.gov/pubs/sp/800/63/c/4/final | |
| | | <sub>↑ - Cloud Security Alliance Cloud Controls Matrix — https://cloudsecurityalliance.org/research/cloud-controls-matrix</sub> | |
| 6 | `04-phase-cloud-identity-architecture.md:2130` | Everything this phase teaches can be built on free tiers, with **one scoped exception stated plainly rather than glossed**: Conditional Access is an Entra ID **P1** feature and is not in the free tier — the same licence boundary the cyber track's cloud-and-ide … | |
| 7 | `05-phase-adversary-emulation.md:1194` | - NIST SP 800-115, Technical Guide to Information Security Testing and Assessment — https://csrc.nist.gov/pubs/sp/800/115/final | |
| 8 | `06-phase-programme-and-influence.md:1225` | - NIST SP 800-30 Rev. 1, Guide for Conducting Risk Assessments — https://csrc.nist.gov/pubs/sp/800/30/r1/final | |
| 9 | `06-phase-programme-and-influence.md:1226` | - NIST SP 800-39, Managing Information Security Risk — https://csrc.nist.gov/pubs/sp/800/39/final | |
| | | <sub>↑ - NIST SP 800-30 Rev. 1, Guide for Conducting Risk Assessments — https://csrc.nist.gov/pubs/sp/800/30/r1/final<br>↓ - NIST SP 800-50 Rev. 1, Building an IT Security Awareness and Training Program — https://csrc.nist.gov/pubs/sp/800/50/r1/final</sub> | |
| 10 | `06-phase-programme-and-influence.md:1227` | - NIST SP 800-50 Rev. 1, Building an IT Security Awareness and Training Program — https://csrc.nist.gov/pubs/sp/800/50/r1/final | |
| 11 | `06-phase-programme-and-influence.md:1228` | - NIST SP 800-61 Rev. 3, Incident Response Recommendations and Considerations for Cybersecurity Risk Management — https://csrc.nist.gov/pubs/sp/800/61/r3/final | |
| 12 | `06-phase-programme-and-influence.md:1413` | Every artefact in this phase is a document, a spreadsheet, or a conversation, and none of them requires a licence. LibreOffice Calc or Google Sheets carries the metric register and the dashboard; GitHub Issues or GitLab Issues carries the action tracker; a Mar … | |
