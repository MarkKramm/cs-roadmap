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

# Detection-as-code tool flags and status

| 1 | `01-phase-detection-at-scale.md:1299` | \| Sigma and sigma-cli \| Vendor-neutral rule format, and a converter to platform query languages \| Free/open-source \| https://sigmahq.io/ \| Write one rule and convert it with `sigma convert -t splunk rule.yml` \| Hand-written SPL or KQL kept in Git \| | **OK** — the tool's own source (pyproject.toml), https://raw.githubusercontent.com/SigmaHQ/sigma-cli/main/pyproject.toml — `license = "LGPL-2.1-or-later"`; and `sigma convert` defines `--target` / `-t` (https://raw.githubusercontent.com/SigmaHQ/sigma-cli/main/sigma/cli/convert.py — `"--target", "-t",`), so `sigma convert -t splunk rule.yml` is a valid invocation (`splunk` itself needs pySigma-backend-splunk installed). |
| 2 | `02-phase-threat-hunting.md:616` | The older `sigmac` script you will find in blog posts is deprecated. Use `sigma-cli`. | **OK** — the project's own README (primary, SigmaHQ), https://raw.githubusercontent.com/SigmaHQ/pySigma/main/README.md — "`pySigma` is a python library that parses and converts Sigma rules into queries. It is a replacement for the legacy Sigma toolchain (sigmac)". Reinforced by sigma-cli's own main.py, which hard-fails if the legacy package is importable: "the legacy 'sigmatools' package is installed ... Please uninstall 'sigmatools'". The word used upstream is "legacy"/"replacement", not the formal "deprecated". |
| 3 | `07-phase-detection-as-code.md:51` | - `sigma-cli` and pySigma: the current toolchain, and why `sigmac` is not in it | **OK** — the projects' own READMEs (primary, SigmaHQ), https://raw.githubusercontent.com/SigmaHQ/pySigma/main/README.md — "It is a replacement for the legacy Sigma toolchain (sigmac)" and "`[sigma-cli](https://github.com/SigmaHQ/sigma-cli)` is the equivalent of sigmac for command-line conversion". |
| | | <sub>↑ - Unit testing rules with pytest, and the difference between a schema test and a logic test<br>↓ - Validation with `sigma check`, validator plugins, and a validation configuration file</sub> | |
| 4 | `07-phase-detection-as-code.md:52` | - Validation with `sigma check`, validator plugins, and a validation configuration file | **OK** — the tool's own CLI definition, https://raw.githubusercontent.com/SigmaHQ/sigma-cli/main/sigma/cli/check.py — `"--validation-config", "-c", type=click.File("r"), help="Validation configuration file in YAML format."` and `plugins = InstalledSigmaPlugins.autodiscover()` / `validators = plugins.validators`; registered as a subcommand at https://raw.githubusercontent.com/SigmaHQ/sigma-cli/main/sigma/cli/main.py — `cli.add_command(check)`. |
| | | <sub>↑ - `sigma-cli` and pySigma: the current toolchain, and why `sigmac` is not in it<br>↓ - CI/CD for detections: a GitHub Actions pipeline, artifacts, and required status checks</sub> | |
| 5 | `07-phase-detection-as-code.md:384` | **That table is not a disclaimer; it is the reason you need three kinds of test.** A simple fixture harness checks that examples are present; a backend validation with `sigma check` covers structure and conventions. To test whether the rule matches positive an … | **UNVERIFIABLE** — pedagogical argument about test methodology ("you need three kinds of test"), i.e. judgement and recommendation. The embedded tool reference (`sigma check` validates rules) is real, but the row's actual claim is a method argument, not a fact about the world. |
| 6 | `07-phase-detection-as-code.md:532` | `sigma check` is the real subcommand, and its flags are worth knowing precisely: `--fail-on-error` (the default) fails on parsing errors, `--fail-on-issues` fails on validation issues, `--validation-config` or `-c` points at a YAML configuration file, `--exclu … | **OK** — the tool's own CLI definition (every name, short form and default confirmed), https://raw.githubusercontent.com/SigmaHQ/sigma-cli/main/sigma/cli/check.py — `"--validation-config", "-c"`; `"--file-pattern", "-P"`; `"--fail-on-error/--pass-on-error", "-e/-E", default=True, help="Fail on Sigma rule parsing errors."`; `"--fail-on-issues/--pass-on-issues", "-i/-I", default=False`; `"--junitxml" ... help="Output results in JUnit XML format to the specified file."`; `"--exclude", "-x", multiple=True, help="...Repeat --exclude for multiple exclusions."`. The "return code of 1" claim is also in source: `click.get_current_context().exit(1)`. Two small refinements: `--fail-on-error` covers condition errors as well as parse errors, and its short forms are `-e`/`-E` (the row does not claim otherwise). |
| 7 | `07-phase-detection-as-code.md:550` | You will find `sigmac` in blog posts, in older internal documentation, and in half the conversion recipes on the internet. **It is the retired legacy Sigma toolchain.** pySigma describes itself in its own README as "a replacement for the legacy Sigma toolchain … | **OK** — the project's own README, quoted verbatim and accurately, https://raw.githubusercontent.com/SigmaHQ/pySigma/main/README.md — "It is a replacement for the legacy Sigma toolchain (sigmac)" and "`[sigma-cli](https://github.com/SigmaHQ/sigma-cli) is the equivalent of sigmac for command-line conversion". Both quoted strings are exact. |
| 8 | `07-phase-detection-as-code.md:552` | \| \| `sigmac` (retired) \| `sigma-cli` (current) \| | **UNVERIFIABLE** — this is a markdown table *header* row, not a claim; the grey context confirms the next line is the `\|---\|---\|---\|` separator. The words "(retired)" / "(current)" are the curriculum's paraphrase — upstream says "legacy" and "replacement", never "retired". |
| | | <sub>↓ \|---\|---\|---\|</sub> | |
| 9 | `07-phase-detection-as-code.md:557` | \| Discovery \| Read the source to find supported targets \| `sigma list`, `sigma plugin list` \| | **OK** — the tool's own source and README, https://raw.githubusercontent.com/SigmaHQ/sigma-cli/main/sigma/cli/list.py — `@click.group(name="list", help="List available targets or processing pipelines.")`; and README https://raw.githubusercontent.com/SigmaHQ/sigma-cli/main/README.md — "To list all available plugins run the following command: `sigma plugin list`". The `sigmac` column ("Read the source…") is not independently checkable — the legacy repo is gone — but the actionable half is confirmed. |
| | | <sub>↑ \| Pipelines \| Configuration files \| Processing pipeline objects, also plugin-provided \|<br>↓ \| Validation \| Not provided \| `sigma check` with validator plugins \|</sub> | |
| 10 | `07-phase-detection-as-code.md:558` | \| Validation \| Not provided \| `sigma check` with validator plugins \| | **OK** — the tool's own CLI definition, https://raw.githubusercontent.com/SigmaHQ/sigma-cli/main/sigma/cli/check.py — `@click.command()` `def check(...)` with `rule_validator = SigmaValidator(validators_filtered)` built from `plugins = InstalledSigmaPlugins.autodiscover()` / `validators = plugins.validators`; registered at https://raw.githubusercontent.com/SigmaHQ/sigma-cli/main/sigma/cli/main.py — `cli.add_command(check)`. The `sigmac` column ("Not provided") is not independently checkable — the legacy repo is gone. |
| | | <sub>↑ \| Discovery \| Read the source to find supported targets \| `sigma list`, `sigma plugin list` \|<br>↓ \| Status \| Legacy, replaced \| Current, a replacement for the legacy toolchain \|</sub> | |
| 11 | `07-phase-detection-as-code.md:561` | If you follow a tutorial that tells you to run `sigmac`, you are following a tutorial written for a tool that the project it belongs to has replaced. The correct response is to find the current tool's equivalent, not to install the old one. | **UNVERIFIABLE** — prescriptive advice ("the correct response is to…"). Its factual premise *is* settled by https://raw.githubusercontent.com/SigmaHQ/pySigma/main/README.md — "It is a replacement for the legacy Sigma toolchain (sigmac)" — but the row as written is guidance, not a checkable fact. |
| 12 | `07-phase-detection-as-code.md:654` | **`--fail-on-issues` is not the default.** `sigma check` fails on errors by default but passes on validation issues unless you ask for the stricter behaviour. If you want an empty `falsepositives` list to block a merge, you must say so. | **WRONG** (second sentence only) — the headline default is **correct**: https://raw.githubusercontent.com/SigmaHQ/sigma-cli/main/sigma/cli/check.py — `"--fail-on-error/--pass-on-error", "-e/-E", default=True` and `"--fail-on-issues/--pass-on-issues", "-i/-I", default=False`, with the exit gate `if (fail_on_error and (rule_error_count > 0 or cond_error_count > 0) or fail_on_issues and issue_count > 0): ... exit(1)`. The `falsepositives` sentence is wrong: pySigma has **no `falsepositives` validator at all**, so `--fail-on-issues` can never make an empty list block. The only check on the field is a type check — https://raw.githubusercontent.com/SigmaHQ/pySigma/main/sigma/rule/base.py — `if rule_falsepositives is not None and not isinstance(rule_falsepositives, list): raise sigma_exceptions.SigmaFalsePositivesError("Sigma rule falsepositives must be a list")`. The complete core validator set is listed at https://raw.githubusercontent.com/SigmaHQ/pySigma/main/docs/guides/rule_validation.rst and contains no falsepositives entry. You would need a custom validator plugin. |
| 13 | `07-phase-detection-as-code.md:666` | \| `sigma check` reports a parse error \| YAML indentation or an unquoted special character \| Fix the rule; commonly a backslash or a leading `*` \| | **UNVERIFIABLE** — troubleshooting heuristics ("what it usually means", "the fix"), not a specifiable fact. A leading unquoted `*` is a YAML alias token and a bare leading `\` is a YAML scanner error, so the advice is plausible, but no primary source states this as the cause of a `sigma check` parse error, and pySigma raises generic `SigmaValueError` / `SigmaCollectionError` without such a diagnosis. |
| 14 | `07-phase-detection-as-code.md:718` | \| Output directory \| `--output-dir` \| One file per rule, which is what you want in Git \| | **OK** — the tool's own README, https://raw.githubusercontent.com/SigmaHQ/sigma-cli/main/README.md — "use the `--output-dir` parameter along with `--output-filename-template`" and "This will create a separate file for each converted rule in the `translated_rules/` directory." The grey context line is also right: "Use `-O` or `--backend-option` for passing options to the backend as key=value pairs (`-O testparam=123`)". |
| | | <sub>↑ \| Backend option \| `-O` \| Backend-specific behaviour, as `key=value` \|</sub> | |
| 15 | `07-phase-detection-as-code.md:1187` | **In an interview, say:** “I run my detections as code — Sigma rules in Git, fixtures for positive, negative, and near-miss cases, a CI pipeline that validates with `sigma check` and runs the tests, and conversion artifacts for each backend. I have measured pr … | **UNVERIFIABLE** — a scripted first-person answer the learner is told to recite. The embedded tool reference (`sigma check` validates rules) is real, but the row's substance is interview coaching plus claims about the speaker's own unrecorded work. |
| 16 | `07-phase-detection-as-code.md:1202` | - **`sigmac` is the retired legacy toolchain.** pySigma describes itself as its replacement and `sigma-cli` as the command-line equivalent. Use `sigma-cli`. | **OK** — the project's own README, https://raw.githubusercontent.com/SigmaHQ/pySigma/main/README.md — "It is a replacement for the legacy Sigma toolchain (sigmac)" / "`[sigma-cli](https://github.com/SigmaHQ/sigma-cli) is the equivalent of sigmac for command-line conversion". Both attributions are accurate. |
| 17 | `07-phase-detection-as-code.md:1203` | - **`sigma check` fails on errors by default but passes on issues unless you pass `--fail-on-issues`.** If you want an empty `falsepositives` list to block a merge, you must ask for the stricter behaviour. | **WRONG** (second sentence only) — the headline default is **correct**: https://raw.githubusercontent.com/SigmaHQ/sigma-cli/main/sigma/cli/check.py — `"--fail-on-error/--pass-on-error", "-e/-E", default=True`, `"--fail-on-issues/--pass-on-issues", "-i/-I", default=False`, gate `if (fail_on_error and (rule_error_count > 0 or cond_error_count > 0) or fail_on_issues and issue_count > 0): ... exit(1)`. The `falsepositives` sentence is wrong: pySigma ships **no `falsepositives` validator**, so `--fail-on-issues` cannot make an empty list block a merge. Only a type check exists — https://raw.githubusercontent.com/SigmaHQ/pySigma/main/sigma/rule/base.py — `SigmaFalsePositivesError("Sigma rule falsepositives must be a list")`; and the full core validator list at https://raw.githubusercontent.com/SigmaHQ/pySigma/main/docs/guides/rule_validation.rst has no falsepositives entry. Note the related SigmaHQ convention is documentation only, unenforced by the tooling — https://raw.githubusercontent.com/SigmaHQ/sigma-specification/main/sigmahq/sigmahq-rule-convention.md — "In cases where the author doesn't know of any false positives the value should be `Unknown`" and "Keywords such as `None`, `Pentest`… are not accepted as valid values." |
| 18 | `07-phase-detection-as-code.md:1223` | 5. **Wire the pipeline** (task 5) as a GitHub Actions workflow that validates with `sigma check`, runs the tests, converts for two targets, and uploads the artifacts. Then open a PR that deliberately breaks a rule and confirm CI blocks it. | **UNVERIFIABLE** — an exercise instruction to the learner, not a checkable assertion. The tools it names are all real and the flags used in the referenced workflow (`:626`) are valid, but whether a given broken rule blocks CI depends on whether the break is a parse error (always blocks) or a validation issue (blocks only with `--fail-on-issues`), so "confirm CI blocks it" is not a universal fact. |
| 19 | `07-phase-detection-as-code.md:1239` | \| sigma-cli \| Converts Sigma rules to backend query languages and validates them \| Free/open-source \| https://github.com/SigmaHQ/sigma-cli \| Run `sigma check --fail-on-error --fail-on-issues rules/` on your migrated rules \| Hand-written queries per platf … | **OK** — the tool's own manifest and source, https://raw.githubusercontent.com/SigmaHQ/sigma-cli/main/pyproject.toml — `name = "sigma-cli"`, `description = "Sigma Command Line Interface (conversion, check etc.) based on pySigma"`, `license = "LGPL-2.1-or-later"`. Both `sigma convert` and `sigma check` are real subcommands (https://raw.githubusercontent.com/SigmaHQ/sigma-cli/main/sigma/cli/main.py — `cli.add_command(convert)` / `cli.add_command(check)`), both flags are valid booleans, and the directory argument works: `load_rules` calls `SigmaCollection.resolve_paths([path], recursion_pattern="**/" + file_pattern)`. |
| 20 | `07-phase-detection-as-code.md:1302` | - A GitHub Actions workflow that validates with `sigma check`, runs the tests, converts, and uploads artifacts | **UNVERIFIABLE** — a checklist item describing a deliverable the learner must build, not a factual claim. The named tool exists (https://raw.githubusercontent.com/SigmaHQ/sigma-cli/main/sigma/cli/main.py — `cli.add_command(check)`), but there is nothing here to verify. |
