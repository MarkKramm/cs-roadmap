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

# Detection-as-code tool flags and status

| 1 | `01-phase-detection-at-scale.md:1299` | \| Sigma and sigma-cli \| Vendor-neutral rule format, and a converter to platform query languages \| Free/open-source \| https://sigmahq.io/ \| Write one rule and convert it with `sigma convert -t splunk rule.yml` \| Hand-written SPL or KQL kept in Git \| | |
| 2 | `02-phase-threat-hunting.md:616` | The older `sigmac` script you will find in blog posts is deprecated. Use `sigma-cli`. | |
| 3 | `07-phase-detection-as-code.md:51` | - `sigma-cli` and pySigma: the current toolchain, and why `sigmac` is not in it | |
| | | <sub>↑ - Unit testing rules with pytest, and the difference between a schema test and a logic test<br>↓ - Validation with `sigma check`, validator plugins, and a validation configuration file</sub> | |
| 4 | `07-phase-detection-as-code.md:52` | - Validation with `sigma check`, validator plugins, and a validation configuration file | |
| | | <sub>↑ - `sigma-cli` and pySigma: the current toolchain, and why `sigmac` is not in it<br>↓ - CI/CD for detections: a GitHub Actions pipeline, artifacts, and required status checks</sub> | |
| 5 | `07-phase-detection-as-code.md:384` | **That table is not a disclaimer; it is the reason you need three kinds of test.** A simple fixture harness checks that examples are present; a backend validation with `sigma check` covers structure and conventions. To test whether the rule matches positive an … | |
| 6 | `07-phase-detection-as-code.md:532` | `sigma check` is the real subcommand, and its flags are worth knowing precisely: `--fail-on-error` (the default) fails on parsing errors, `--fail-on-issues` fails on validation issues, `--validation-config` or `-c` points at a YAML configuration file, `--exclu … | |
| 7 | `07-phase-detection-as-code.md:550` | You will find `sigmac` in blog posts, in older internal documentation, and in half the conversion recipes on the internet. **It is the retired legacy Sigma toolchain.** pySigma describes itself in its own README as "a replacement for the legacy Sigma toolchain … | |
| 8 | `07-phase-detection-as-code.md:552` | \| \| `sigmac` (retired) \| `sigma-cli` (current) \| | |
| | | <sub>↓ \|---\|---\|---\|</sub> | |
| 9 | `07-phase-detection-as-code.md:557` | \| Discovery \| Read the source to find supported targets \| `sigma list`, `sigma plugin list` \| | |
| | | <sub>↑ \| Pipelines \| Configuration files \| Processing pipeline objects, also plugin-provided \|<br>↓ \| Validation \| Not provided \| `sigma check` with validator plugins \|</sub> | |
| 10 | `07-phase-detection-as-code.md:558` | \| Validation \| Not provided \| `sigma check` with validator plugins \| | |
| | | <sub>↑ \| Discovery \| Read the source to find supported targets \| `sigma list`, `sigma plugin list` \|<br>↓ \| Status \| Legacy, replaced \| Current, a replacement for the legacy toolchain \|</sub> | |
| 11 | `07-phase-detection-as-code.md:561` | If you follow a tutorial that tells you to run `sigmac`, you are following a tutorial written for a tool that the project it belongs to has replaced. The correct response is to find the current tool's equivalent, not to install the old one. | |
| 12 | `07-phase-detection-as-code.md:654` | **`--fail-on-issues` is not the default.** `sigma check` fails on errors by default but passes on validation issues unless you ask for the stricter behaviour. If you want an empty `falsepositives` list to block a merge, you must say so. | |
| 13 | `07-phase-detection-as-code.md:666` | \| `sigma check` reports a parse error \| YAML indentation or an unquoted special character \| Fix the rule; commonly a backslash or a leading `*` \| | |
| 14 | `07-phase-detection-as-code.md:718` | \| Output directory \| `--output-dir` \| One file per rule, which is what you want in Git \| | |
| | | <sub>↑ \| Backend option \| `-O` \| Backend-specific behaviour, as `key=value` \|</sub> | |
| 15 | `07-phase-detection-as-code.md:1187` | **In an interview, say:** “I run my detections as code — Sigma rules in Git, fixtures for positive, negative, and near-miss cases, a CI pipeline that validates with `sigma check` and runs the tests, and conversion artifacts for each backend. I have measured pr … | |
| 16 | `07-phase-detection-as-code.md:1202` | - **`sigmac` is the retired legacy toolchain.** pySigma describes itself as its replacement and `sigma-cli` as the command-line equivalent. Use `sigma-cli`. | |
| 17 | `07-phase-detection-as-code.md:1203` | - **`sigma check` fails on errors by default but passes on issues unless you pass `--fail-on-issues`.** If you want an empty `falsepositives` list to block a merge, you must ask for the stricter behaviour. | |
| 18 | `07-phase-detection-as-code.md:1223` | 5. **Wire the pipeline** (task 5) as a GitHub Actions workflow that validates with `sigma check`, runs the tests, converts for two targets, and uploads the artifacts. Then open a PR that deliberately breaks a rule and confirm CI blocks it. | |
| 19 | `07-phase-detection-as-code.md:1239` | \| sigma-cli \| Converts Sigma rules to backend query languages and validates them \| Free/open-source \| https://github.com/SigmaHQ/sigma-cli \| Run `sigma check --fail-on-error --fail-on-issues rules/` on your migrated rules \| Hand-written queries per platf … | |
| 20 | `07-phase-detection-as-code.md:1302` | - A GitHub Actions workflow that validates with `sigma check`, runs the tests, converts, and uploads artifacts | |
