# Workflow

How to make changes safely in this repository.

## Prerequisites

See [`SETUP.md`](SETUP.md). In short: Git plus any editor that reads `.editorconfig`.

## The change loop

1. **Edit** the relevant Markdown file.
2. **Check line endings and encoding** (see below) — this is the step that prevents the corruption this repo already recovered from once.
3. **Stage and review:** `git add -A` then `git --no-pager diff --cached`.
4. **Commit** with a conventional prefix: `docs:`, `chore:`, or `fix:`.
5. **Verify** the tree is clean: `git status --short`.

## Line-ending and encoding rules

These are enforced two ways:

- `.gitattributes` normalizes on the Git side (index and checkout).
- `.editorconfig` normalizes on the editor side (on save).

If a file still arrives with CRLF on disk, re-materialize it from Git:

```powershell
Remove-Item -Force <file>
git checkout -- <file>
```

To audit a file's raw bytes on Windows PowerShell:

```powershell
$b = [System.IO.File]::ReadAllBytes('<file>')
($b | Where-Object { $_ -eq 13 }).Count   # CR count; should be 0 for text files
```

## Typographic characters

Use real characters, not ASCII substitutes:

| Instead of | Use |
|---|---|
| `?` or `--` for a break | `—` (em-dash, U+2014), ` ? ` → ` — ` |
| `-` between numbers | `–` (en-dash, U+2013), e.g. `3–6 months` |
| `"..."` for quoted UI text | `“ ”` (curly quotes, U+201C/U+201D) |
| `???` for tree branches | `├──` / `└──` (U+251C / U+2514 + U+2500) |

## Commit message conventions

- `docs:` — content or documentation changes.
- `chore:` — tooling, config, housekeeping.
- `fix:` — corrections to broken content or formatting.

Keep the subject line imperative and under ~72 characters.

## Linting

Run the text-integrity linter before committing content or docs:

```powershell
node scripts/lint-content.mjs
```

It flags CRLF, UTF-8 BOM, U+FFFD replacement characters, invalid UTF-8, and ASCII `?` standing in for typographic characters. Exit code is non-zero on any issue, so it can gate a commit. It does not rewrite files — repair procedures are in [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md).

Note: when creating a new file, the editor in this environment has repeatedly written CRLF and, once, a U+FFFD pair. Run the linter after creating any file. If it reports CRLF, normalize with the `Remove-Item` + `git checkout --` recipe above, or a direct UTF-8 rewrite for untracked files.

## Verifying a content edit changed nothing structural

The build turns the phase Markdown into `learning-site/src/data/generated/{it,cyber,advance}.json`, and that JSON is what the site renders. To prove an edit was content-only — a lesson, a reworded paragraph — capture the JSON before and after and diff it, ignoring `generatedAt`:

```powershell
Copy-Item 'learning-site\src\data\generated\it.json' 'it.baseline.json'
# ... make the edit ...
node scripts/build-content.mjs
Copy-Item 'learning-site\src\data\generated\it.json' 'it.current.json'
# diff the two copies
```

Delete both copies when you are done. The linter walks the whole repository and counts every file with a checkable extension, `.json` included, so leaving them at the root inflates the file count it reports.

A pre-edit baseline only proves the document did not move. It cannot tell you the document was already correct — if the damage predates the baseline, the baseline records the damage. To check against the last commit instead, build the committed content in a scratch worktree:

```powershell
git worktree add '.head-check' HEAD
cd '.head-check'; node scripts/build-content.mjs
# compare .head-check/learning-site/src/data/generated/it.json with the working tree's
cd ..; git worktree remove '.head-check' --force
```

**Do this whenever a phase file's structure is edited, not just its prose.** Tool-table rows carry no IDs, so no task-ID or checklist-ID comparison can see one go missing; the only symptom is a smaller tools library. `HEAD` may not build at all — `build-content.mjs` writes no output when it fails — in which case copy the current version of the offending file into the worktree first.

## Continuous integration

`.github/workflows/ci.yml` runs on every push to `main` and every pull request. It has three jobs:

| Job | What it runs | Working directory |
|---|---|---|
| Content integrity | Node-based content lint and structural, readability, reference, quiz, encoding, exam, claim, and documentation audits; the related guard-control suites; and arithmetic and workflow validation. No dependency install. | repository root |
| Learning site | Node 24, `npm ci`, production build, smoke render, and the 14 `test-*.mjs` site suites defined under `learning-site/scripts/`. | `learning-site/` |
| Browser check (Chromium) | Node 24, dependency install and build, then the real-browser layout and interaction suite against Chromium. Kept separate because it needs a browser engine. | `learning-site/` |

The workflow runs Node 24 in all three jobs. It is check-only: it does not deploy or publish the site — deployment is handled separately. The workflow file is the source of truth for the exact check list; see [`DECISIONS.md`](DECISIONS.md) → D-008 and [`CHECKPOINT.md`](CHECKPOINT.md) → "How to verify quickly" for local commands.

`cyber-restructure-check.mjs` is deliberately **not** a CI step: it reads a before-snapshot from `process.env.TEMP`, which is not in the repository, so it can only ever fail on a fresh clone. It is a one-off migration tool, not a standing guard.

The `Browser check (real engine)` step is the one that needs a process manager. It starts `vite preview`, polls it with `curl` rather than sleeping a fixed interval, runs `npm run test:browser`, and kills the server on both the success and failure paths — a background process started in an earlier step is not reliably still listening in a later one. It sets two variables that matter:

- `BROWSER_NO_SANDBOX=1` — a container does not grant the kernel capability Chrome's sandbox requires. Locally the sandbox stays on.
- `BROWSER_CHECK_STRICT=1` — makes a missing browser a **failure** rather than a skip. Without it the script exits 0 with `BROWSER CHECK SKIPPED`, which is indistinguishable from a passing run to anything reading only the exit code. The script also fails if fewer than its configured minimum checks ran, catching a run that connected to an error page and asserted almost nothing.

## Guards on the lesson renderer

The site renders the lesson prose itself (D-011), so the parser in `scripts/lesson-ast.mjs` sits between the Markdown and the page. A parser bug does not crash the build — it makes content quietly disappear from the site. Two guards exist because of that:

```bash
node scripts/audit-lesson-ast.mjs   # parser vs source: no content loss, no unhandled construct
node scripts/audit-readability.mjs  # prose density targets
cd learning-site && npm run test:smoke   # the lesson renders for every phase
```

**Run `audit-lesson-ast.mjs` after any change to `lesson-ast.mjs`.** It compares each lesson's parsed blocks against its source with markup stripped, and reports a non-zero delta, an unrecognised construct, or a lesson with no headings. It currently reports zero loss on all 31 lessons.

## Guards on the curriculum text

Two more guards run over the phase Markdown itself, and they catch different things:

```bash
node scripts/audit-refs.mjs              # every "Part N" and "Phase N" reference resolves
node scripts/audit-time-budget.mjs       # stated totals match their own parts and overview
node scripts/audit-changelog.mjs         # one of each section per release, canonical order
node scripts/test-audit-changelog.mjs    # the CHANGELOG guard's own 13 controls, gates
node scripts/audit-quiz.mjs              # quiz answer positions balanced, option counts consistent
node scripts/validate-ci.mjs             # every CI step well-formed, every script it names exists
node scripts/verify-cidr.mjs             # subnet arithmetic recomputed; RFC 1918 ranges checked
node scripts/verify-metrics.mjs          # IT 06's worked metrics recomputed from its own table
node scripts/audit-commands.mjs          # DISM/sfc/chkdsk written in a form that actually runs
node scripts/audit-terms.mjs --self-test # the acronym DETECTOR — 16 controls, gates
node scripts/audit-terms.mjs             # the acronym CORPUS — measurement, always exits 0
```

**The two `verify-*` scripts are the only checks here that test whether the content is *true* rather than whether it agrees with itself** (D-036). Every other guard asks "do two places in this repository say the same thing". These recompute claims that have an answer independent of the document — subnet arithmetic, and a worked example whose stated result must follow from its own data. Both are the strongest tier available, because they depend on trusting nobody's documentation, mine included.

`scripts/verify-ports.mjs` is the same idea against an external authority — the IANA registry that *assigns* port numbers — and it is **deliberately not in CI**: it needs the network, so its failure mode would eventually be "IANA was unreachable", which is a red build with nothing wrong with the content. Run it by hand after editing a port table.

**`audit-commands.mjs` catches a narrower thing, and it exists because the defect happened twice.** A command can be *named* correctly and *written* wrongly: IT 02 stated `DISM /Online /Cleanup-Image /RestoreHealth` in full at one place and `DISM /RestoreHealth` in a summary table 300 lines later. The second throws if a beginner types it. Nothing was inconsistent and nobody lied — a table cell invites shortening, and the abbreviation silently became a different, broken command. The same shape had already occurred in an IT 01 case-study log. It checks the exact string a reader would copy, not the command name.

`scripts/extract-claims.mjs` is not a check at all. It pulls every machine-checkable claim out of the nine IT phases into [`IT-CLAIM-VERIFICATION.md`](IT-CLAIM-VERIFICATION.md), which is a worklist for verifying the classes a machine cannot settle. Run it after editing phase content; it overwrites the file.

**`audit-refs.mjs` gates, and `FORWARD_AS_PRIOR` is now a detector rather than a `(0)` nobody could trust.** It exits 1 when a `Part N` names a heading the file does not have, or a `Phase N` names a number the track does not contain — both are claims about the text agreeing with itself, which is the test for whether a class belongs in CI. It found IT 06 sending the reader to "Part 5's structure" for a note in Part 4, and IT 07 referring to a nonexistent "Part 8".

It also prints `FORWARD_AS_PRIOR`, a phase citing a later phase as prior knowledge, and that class still does **not** gate: whether citing a later phase is acceptable is a judgement about the reader, not a property of the two strings. What changed is that the *instrument* is now trustworthy, and it was not before. Its call site sliced `line.slice(0, m.index + 4)` — four characters from the match start, i.e. `"Phas"` — while the cue regex needs the literal word `Phase`, so the detector **could never fire**. Every run since it was written reported `(0)`, and a zero from a detector that cannot fire is indistinguishable from a corpus that has none. It now slices `m.index + m[0].length`, reports **2 real observations** (IT 01 at lines 899 and 1015), and carries **10 controls** (6 must-fire, 4 must-NOT-fire) that run on every invocation and exit non-zero **before any finding prints**. `--self-test` runs only the controls. Read the findings; the controls are what make the count worth reading.

**`audit-time-budget.mjs` gates, and it is the arithmetic class made machine-checkable.** It exits 1 when a budget table's parts do not sum to the total it prints, when a stated week range has its minimum above its maximum, when frontmatter `duration`/`duration_weeks` disagrees with the bold lead of the phase's own "Estimated time" line, or when a track overview lists a different week count than the phase file it points at. All four are claims about the text agreeing with itself, which is the test D-022 sets for a gate. It currently reports `phases checked: 31 / findings: 0`. The class it covers was the most productive one in both comprehension passes — a stated 60–80 hours above parts summing to 40–56, a phase calling itself the heaviest when a later one budgets three times as much, an overview listing 4 weeks where every phase file says 6 — and every instance came from an edit that changed one place and not the other. **Its scoping is deliberate and worth preserving:** class 1 keys off the table's own `Hours` column header, so a schedule table with time-ish cells but no Hours column is correctly out of scope, while a table that *has* an Hours column and no checkable total is a finding rather than a silent skip.

**`audit-changelog.mjs` gates, and it is the guard that proves D-033's test is the right test.** `[Unreleased]` accumulated eleven section headings — four `Fixed`, four `Changed`, three `Added` — over at least four commits, and nothing failed, because Keep a Changelog permits one of each per release. A reader looking for what changed had to read four separate `Fixed` lists. They were merged in `b9f6133`, and **the shape returned twice more on 2026-09-16**, each time because a new entry was appended *above* an existing section of the same name rather than into it. It exits 1 on three structural defects: a duplicate section heading in one version block, headings out of canonical order (Added → Changed → Deprecated → Removed → Fixed → Security), and a section heading with no entries or a version block with neither sections nor prose. `[0.1.0]` is checked exactly like `[Unreleased]`, because this repo still amends it.

**It gates where the topic-list guard could not, and the difference is the whole lesson.** D-033 records that a guard over a phase's `## Specific topics to learn` was investigated and rejected: a keyword probe returned hits for all five known-undelivered topics — a 0% detection rate — because probing `Startup apps` matched the topic list, the skills list, and a *practice task*. Three promises, no teaching, so a presence-based check counted a promise as delivery and **its pass path looked like its skip path**. This guard asks whether a heading string occurs more than once, which is arithmetic on the document: a failing result is distinguishable from a passing result *by the check itself*. That is the test to apply before writing the next guard — and if a candidate cannot fail on a defect you already know exists, do not build it.

**It found a real fourth defect on its first run** — `[0.1.0]` listed `Fixed` before `Changed` — which is the evidence that it is capable of failing. `test-audit-changelog.mjs` carries **13 controls** and runs in CI beside it: every defect class must exit 1 *and name what it found*, and three legitimate shapes must exit 0 — a release that omits `Security`, a block with only one section, and a prose-only release note with no sections. Without those, a rewrite that silently stopped detecting anything would print the same green line as a healthy corpus. The guard was also verified by **reproducing the historical defect**: injecting a second `### Fixed` above the existing `### Added` produced two findings and exit 1, the duplicate and the order violation it causes.

**`audit-terms.mjs` splits in two, and the split is the whole of D-028.** The *corpus report* — which terms reach the reader before anything says what the letters mean — never gates, and that is the finding rather than a shortcut. It was written to catch that class; five measurement passes moved the domain count 365 → 232 → 232 → 227 → 73, and the residue is still `AMD`, `USD`, `UTC`, `PID`, `NTFS`, `CMD`, `ISP`, `SSID` — two brands, a currency code, and `PID` flagged on the line that reads "**PID** is the process ID". Whether a beginner can decode `SSID` is a judgement about the reader, not a property of the string, so by the rule below it stays a prompt for a periodic human read. See [`COMPREHENSION-AUDIT.md`](COMPREHENSION-AUDIT.md).

**The *expansion detector* inside the same file does gate, and it has to, because it had been lying.** `**SPF** (Sender Policy Framework)` was reported as unexplained **on the line that explains it**, because Markdown emphasis sat between the term and its gloss, so `SPF\s*\(` never matched. Four more shapes were invisible the same way: a noun between term and gloss, the article form the curriculum actually writes (`NOC — a Network Operations Centre`), an em-dash inside the gloss, and table-cell expansions, which have no parenthesis at all — that last one is now tested **by its initials rather than its shape**, so `Governance, Risk, and Compliance` → `GRC` fires and `Collects logs from many sources` for `SIEM` does not. `node scripts/audit-terms.mjs --self-test` runs **16 controls** (6 must-fire, 10 must-NOT-fire) on every invocation, exits 1 before printing any finding, and is the form wired into CI. **The plain form is deliberately not in CI**: it always exits 0, so a green tick would be indistinguishable from a step that never ran. This is the third instance of one defect class in this repository — after the `FORWARD_AS_PRIOR` slice above and the time-budget flag that never cross-checked a table — and in all three the broken version printed a clean result.

**The rule, stated once so it can be applied to the next idea.** A class belongs in CI when it is a claim about the text agreeing with itself — does this name exist, does this number exist. It belongs in a periodic human read when it is a claim about the reader's state — is this term decodable, is this sentence claiming prior knowledge.

`build-content.mjs` also fails the build when the parser reports an unhandled construct, so a new Markdown form cannot ship unrendered — the failure is loud and names the line.

The smoke test renders the lesson for every phase and asserts that the table and code-block counts match the AST, that heading IDs are unique, that every table-of-contents entry resolves, and that no literal `**` or backtick reaches rendered prose. It excludes `<pre>` and `<code>` from that last check, because a `markdown` fence legitimately displays `**bold**` as an example.

**`npm run test:render-inline` guards the inline formatter directly** — `src/lib/renderInline.jsx`, which turns `**bold**`, `*italic*` and `` `code` `` inside a JSON string into React elements. It is a separate guard from the smoke test for the reason D-027 records: the smoke test can only catch a formatter bug on content that already writes the shape that trips it, and `renderInline` had a real one — emphasis and code matched in a single alternation, so a code span whose content contained an asterisk (`Resource: "*"`) shredded both spans and leaked a literal backtick. `advance-04` was the one lesson that wrote it when this issue was discovered. `smoke-render.mjs` caught the symptom; this test holds the **rule**, over 34 cases on the real module, including the exact shipped string and the adjacent nesting shapes. It needs no corpus and no build, so a new lesson that writes `"*"` inside a code span is covered the moment it is authored.

## Checklist before committing

- [ ] `node scripts/lint-content.mjs` reports no issues.
- [ ] `node scripts/audit-lesson-ast.mjs` reports no content loss (for any change touching the parser or a lesson).
- [ ] `node scripts/audit-readability.mjs` reports no phase outside the target.
- [ ] `node scripts/audit-refs.mjs` reports no broken cross-reference (for any change to a phase file).
- [ ] `node scripts/audit-time-budget.mjs` reports `findings: 0` (for any change to a phase file or a track overview).
- [ ] `node scripts/audit-changelog.mjs` reports `findings: 0`, and `node scripts/test-audit-changelog.mjs` reports `13 passed, 0 failed` (after any edit to `CHANGELOG.md`, and after any edit to either script).
- [ ] `node scripts/audit-quiz.mjs` reports `findings: 0` (after any edit to a `## Quiz` section, or to the quiz parser).
- [ ] `node scripts/verify-cidr.mjs` and `node scripts/verify-metrics.mjs` both pass (after any edit to a subnet table, a worked networking example, or IT 06's ticket data).
- [ ] `node scripts/audit-commands.mjs` passes (after any edit that adds or shortens a `DISM`, `sfc`, or `chkdsk` invocation — especially inside a table cell, which is where the shortening happens).
- [ ] `node scripts/verify-ports.mjs --refresh` passes (after any edit to a port table — run by hand, since it needs the network).
- [ ] If phase prose changed, `node scripts/extract-claims.mjs` was re-run so [`IT-CLAIM-VERIFICATION.md`](IT-CLAIM-VERIFICATION.md) matches the content.
- [ ] `node scripts/validate-ci.mjs` reports `0 problems` (after any edit to `.github/workflows/`, or after renaming any script a workflow names).
- [ ] `cd learning-site && npm run test:smoke` passes (for any change touching the site).
- [ ] `cd learning-site && npm run test:render-inline` passes (for any change to `renderInline.jsx` or to inline Markdown in the content).
- [ ] `cd learning-site && npm run test:browser` passes with a preview server running (for any change touching a view, a stylesheet or a control).
- [ ] File is LF (no CR bytes) unless it is a Windows-native script.
- [ ] File is UTF-8 without BOM.
- [ ] Typographic characters are real, not `?` substitutes.
- [ ] `git status --short` is clean after committing.
- [ ] For a structural change to a phase file, `it.json` diffed against a scratch worktree at `HEAD` shows only the differences you intended — see "Verifying a content edit changed nothing structural".