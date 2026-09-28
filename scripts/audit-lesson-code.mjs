// Guard: the code inside the lessons has never been parsed, and the class of
// defect it belongs to has been found by hand three times and by machine never.
//
// WHY THIS EXISTS
//
// Every other guard in this repository tests *internal consistency*: does the
// parser lose content, do cross-references resolve, do a table sum to the
// number the prose claims. The comprehension passes ask a different question --
// can a beginner follow this. Both are blind to a code block that is internally
// coherent, clearly written, and does not work.
//
// The comprehension passes found that class three times, by reading:
//   - cyber-12's corrected auto-closer printed `evaluated`, which is defined
//     nowhere -- a NameError in the centrepiece of the lesson.
//   - cyber-12's `from lookup import ...` had no `lookup.py` in scope, because
//     the earlier example was never given a filename.
//   - cyber-10's Wazuh rule used a positive field match for the parents it meant
//     to EXCLUDE, so it fired when the parent *was* the management tool -- the
//     inverse of the Sigma and SPL versions it is presented as equivalent to.
//
// The claim-verification passes do not catch these either. They check whether a
// claim is *true against a primary source*; they never ask whether a block runs.
// So the corpus carries several hundred fenced blocks, a claim-verified corpus
// of 1,144 recorded rows, and not one block of it has been parsed by a machine.
// The exact block count is printed by `--report` and asserted by the control
// suite rather than written here, because a figure in a comment is a figure that
// goes stale -- which is the entire subject of the bundle-size line this
// repository is currently carrying uncorrected.
//
// The failure is the most expensive kind for a beginner, because it presents as
// the reader's own mistake: a typo in a flag they retyped, a missing file, a
// filter that silently matches nothing. The phase is not wrong; the reader
// concludes the phase is wrong.
//
// WHAT IT DELIBERATELY DOES NOT CHECK
//
// Whether a block is a *good* detection, whether a query returns the right rows,
// and whether the code teaches sound practice. A guard that flags valid usage
// gets switched off within a week, and this repository has recorded that lesson
// repeatedly. The reach here is exactly three things:
//
//   1. The block is not parseable as the language it claims to be.
//   2. A JSON document is shaped in a way its own specification forbids --
//      which is what `JSON.parse` alone cannot see, because valid JSON and a
//      working IAM policy are different claims.
//   3. Two renderings of one rule disagree with each other.
//
// A syntactically valid block that means the wrong thing is still this
// repository's blind spot, and it stays there. That boundary is D-036's, and
// pretending otherwise would be the overclaim this file exists to prevent.
//
// HOW COVERAGE IS REPORTED, AND WHY IT IS THE POINT
//
// This guard has four tiers and, on a given machine, part of what it could check
// it does not check at all. There is no `python`, `pwsh` or `bash` in a default
// Windows install, and `scripts/` is kept dependency-free (AGENTS.md rule 3), so
// there is no YAML parser and no Python parser to reach for either. That is why
// the report ends with a list of what is NOT checked rather than only a list of
// what was.
//
// That means a green run here could mean "three tiers checked four hundred
// blocks" or "one tier checked thirty blocks and two were skipped because the
// tools are missing". Those must never print the same line. So the report states
// per tier how many blocks were found, how many were checked, and what was
// skipped and why -- and a skip is never silent. This is the rule
// `audit-verdict-counts.mjs` was written for: a green line that reads like a
// finished verification is the one output a guard must not be able to produce.
//
// `--report` prints the analysis without failing, so a new check can measure the
// corpus before it is allowed to gate anything. Setting a threshold from a
// number somebody believed rather than one a command printed is D-024's mistake.
//
// USAGE
//   node scripts/audit-lesson-code.mjs           gate (exit 1 on findings)
//   node scripts/audit-lesson-code.mjs --report   analyse only, always exit 0

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

const REPORT_ONLY = process.argv.includes("--report");

// --- reading the corpus -----------------------------------------------------

// Every Markdown file under `career-roadmaps/`, not only `NN-*.md` phase files.
//
// The narrower filter was the obvious first choice and it was wrong, and the way
// it was wrong is the reason this comment is long. `NN-*.md` selects 34 files;
// the corpus has 42, and the 8 it drops are not decoration -- they are the three
// `checklist-master.md` files, two `TOOLBOX.md`, `FREE-TOOL-MAP.md`,
// `WHEN-TO-BUY-THM-PREMIUM.md` and `career-roadmaps/README.md`. The guard
// reported 649 blocks while the corpus holds 650, and the missing one was
// `career-roadmaps/README.md:17`. Nothing was red. The number was simply
// smaller than the truth by one, with no way to tell from the output.
//
// That is the same defect the `\d\d-` digit-pair pattern caused before, which
// blinded five scripts to every phase numbered 10 or above (CHECKPOINT.md,
// "Guards fixed in this pass"). A file filter is a claim about what is covered,
// and a claim nobody can check is not a claim. The control suite now asserts
// the corpus total, so a future narrowing of this list fails a test instead of
// quietly shrinking the denominator.
function phaseFiles() {
  const base = path.join(ROOT, "career-roadmaps");
  const out = [];
  const walk = (dir) => {
    for (const name of fs.readdirSync(dir).sort()) {
      const p = path.join(dir, name);
      if (fs.statSync(p).isDirectory()) walk(p);
      else if (name.endsWith(".md")) out.push(p);
    }
  };
  walk(base);
  return out;
}

// Fenced blocks, with the language from the info string and the 1-based line of
// the opening fence.
//
// CommonMark allows up to three spaces of indent before a fence; four or more is
// an indented code block instead. The corpus does use the tolerance: two
// PowerShell blocks in `it-roadmap/01-phase-computer-fundamentals.md` (198 and
// 287) are list-nested and indented three spaces, and one of them contains a
// hashtable literal. A guard anchored on `^```` silently skips both. The
// tolerance stops at three because four spaces is a lesson about indented code,
// not a code block, and treating it as one would be a guess.
//
// The language is taken from the info string and never inferred from the body:
// `09-phase-cloud-and-identity.md` has an indented ```text block of AWS
// credentials shaped like JSON, and matching on shape would pull teaching
// evidence in as a payload.
const FENCE = /^ {0,3}(`{3,}|~{3,})[ \t]*([^\s`~]*)/;

function fencedBlocks(text) {
  const lines = text.split("\n");
  const blocks = [];
  let open = null;

  for (let i = 0; i < lines.length; i++) {
    const m = FENCE.exec(lines[i]);
    if (!m) {
      if (open) open.body.push(lines[i]);
      continue;
    }
    const marker = m[1];
    const info = m[2];

    if (open === null) {
      open = { fence: marker[0], fenceLen: marker.length, lang: info.toLowerCase(), line: i + 1, body: [] };
      continue;
    }

    // A closing fence repeats the opening fence's character, is at least as long,
    // and carries no info string. A ``` block is allowed to contain a ~~~ line,
    // and an indented ```` block is closed by ```, so both the character and the
    // length have to be compared. Anything else while a block is open is
    // content, not a fence.
    if (marker[0] === open.fence && marker.length >= open.fenceLen && info === "") {
      blocks.push(open);
      open = null;
      continue;
    }
    open.body.push(lines[i]);
  }

  // An unterminated fence is reported rather than silently dropped: a block left
  // open swallows the rest of the phase, which is the same content-loss shape
  // `audit-lesson-ast.mjs` exists for, and it is invisible to a reader because
  // the rendered page merely looks short.
  if (open !== null) {
    blocks.push({ ...open, unterminated: true });
  }

  return blocks;
}

// --- coverage accounting ----------------------------------------------------
//
// Every check reports here, and the report prints all of it. A check that
// examines nothing must say zero examined, not nothing at all -- the difference
// between "nothing to find" and "could not look" is the point of this file.

const coverage = new Map();

function record(tier, { found = 0, checked = 0, skipped = 0, why = [] } = {}) {
  const c = coverage.get(tier) || { found: 0, checked: 0, skipped: 0, why: [] };
  c.found += found;
  c.checked += checked;
  c.skipped += skipped;
  c.why.push(...why);
  coverage.set(tier, c);
}

const findings = [];

// `gates` is false for a check whose findings are for a reader's judgement
// rather than for the build. It is not a softer severity: it is a statement
// about who can decide, and a check that cannot be decided mechanically must not
// be able to turn a build red on a question of intent. Those findings are
// printed in their own section and counted in the exit status only as "there is
// something here", never as a failure.
function finding(tier, where, message, detail = [], { gates = true } = {}) {
  findings.push({ tier, where, message, detail, gates });
}

// --- load the corpus once ---------------------------------------------------

const files = phaseFiles();
const corpus = files.map((file) => {
  const text = fs.readFileSync(file, "utf8");
  return { rel: path.relative(ROOT, file), blocks: fencedBlocks(text) };
});

const byLang = new Map();
for (const c of corpus) {
  for (const b of c.blocks) {
    const k = b.lang || "(unlabelled)";
    byLang.set(k, (byLang.get(k) || 0) + 1);
  }
}

// An unterminated fence is a content-loss defect in its own right, and it is
// reported before any language check runs -- a block that swallowed the rest of
// the file would otherwise be silently absent from every count below.
for (const c of corpus) {
  for (const b of c.blocks) {
    if (b.unterminated) {
      finding(
        "T0 fences",
        `${c.rel}:${b.line}`,
        `a \`${b.lang || "unlabelled"}\` code fence is never closed, so every line after it is read as code`,
        ["This is the shape `audit-lesson-ast.mjs` exists to catch, arriving by a different route."],
      );
    }
  }
}

// === T0.1 — is a ```json block parseable as JSON? ===========================

// MEASURED FIRST, and the measurement changed the design. All 22 ```json blocks
// parse as strict JSON today: no `//` comments, no trailing commas, no
// `<placeholder>` tokens, no `...` truncation, no single-quoted strings. So
// there is no fragment shape to skip and therefore no skip rule -- every block is
// checked and every failure is a finding. A skip rule written for a fragment
// shape that does not exist is a rule that will one day swallow a real defect.
//
// ONE TRAP, RECORDED BECAUSE IT IS AN EASY WAY TO INFLICT THIS FINDING.
// `07-phase-detection-as-code.md` puts `http://198.51.100.44/a.dat` inside a
// JSON *string value*. Stripping `//` comments before parsing -- the reflex
// after reading YAML -- would corrupt that line and report a valid block as
// broken. Nothing here strips anything.

{
  const tier = "T0.1 json parses";
  const lang = "json";
  const candidates = corpus.flatMap((c) =>
    c.blocks.filter((b) => b.lang === lang).map((b) => ({ ...b, rel: c.rel })),
  );
  let checked = 0;
  for (const b of candidates) {
    const body = b.body.join("\n").trim();
    if (!body) {
      record(tier, { found: 1, skipped: 1, why: ["an empty ```json fence has nothing to parse"] });
      continue;
    }
    checked++;
    try {
      JSON.parse(body);
    } catch (e) {
      finding(
        tier,
        `${b.rel}:${b.line}`,
        `a \`\`\`json block is not valid JSON — ${e.message}`,
        [
          "A reader who copies this into a policy editor gets an error that does not name the lesson.",
          "Nothing is stripped before parsing, so a `//` inside a string value cannot cause this.",
        ],
      );
    }
  }
  record(tier, { found: candidates.length, checked });
}

// === T0.2 — is a JSON document shaped the way its own format requires? ======
//
// This is the check `JSON.parse` cannot do, and it is the one that would have
// caught the defect the advance claim pass found by hand: an AWS CLI payload
// with the wrong nesting. That payload was *valid JSON* and an invalid policy.
// "It parses" and "it works" are different claims, and only the first one is
// free.
//
// The four shapes present in the corpus, measured rather than guessed:
//
//   A. identity-policy document — `Version` plus a `Statement` array   (13)
//   B. a single IAM statement   — `Effect`, no `Statement` wrapper     ( 1)
//   C. an Azure Policy          — `if` plus `then`                     ( 2)
//   D. a log event record       — none of the above                   ( 6)
//
// The rule is A's, and it is the format's own: every member of `Statement` is
// itself an object carrying an `Effect` and exactly one of `Action` /
// `NotAction`. Both halves matter. A statement with no `Effect` is silently
// evaluated by AWS; one carrying both `Action` and `NotAction` is a different
// document from the one the reader believes they wrote.
//
// B is the same statement unwrapped for teaching, so it gets the same rule with
// the `Effect`+action check applied directly. C and D are not policy documents
// and are counted, not checked -- a class counted but not examined is a coverage
// number a reader can see, which is the alternative to checking nothing quietly.

{
  const tier = "T0.2 json document shape";
  const parsed = [];

  for (const c of corpus) {
    for (const b of c.blocks) {
      if (b.lang !== "json" || b.unterminated) continue;
      const body = b.body.join("\n").trim();
      if (!body) continue;
      let value;
      try {
        value = JSON.parse(body);
      } catch {
        continue; // already reported by T0.1; not a shape question
      }
      if (value === null || typeof value !== "object" || Array.isArray(value)) continue;
      parsed.push({ ...b, rel: c.rel, value });
    }
  }

  const isPolicyDoc = (o) => typeof o.Version === "string" && Array.isArray(o.Statement);
  const isAzurePolicy = (o) => "if" in o && "then" in o;

  // The check itself. `Action` and `NotAction` are mutually exclusive by
  // definition: one enumerates what is allowed, the other what is denied, and a
  // statement carrying both has no defined meaning.
  const checkStatement = (s, where, blockLine, rel) => {
    if (s === null || typeof s !== "object" || Array.isArray(s)) {
      finding(
        tier,
        `${rel}:${blockLine}`,
        `a member of \`Statement\` is ${Array.isArray(s) ? "an array" : `a ${typeof s}`}, not a statement object`,
        [`at ${where}`, "The policy will be rejected, or silently ignored, by the service consuming it."],
      );
      return;
    }
    const hasAction = "Action" in s;
    const hasNotAction = "NotAction" in s;
    if (!("Effect" in s)) {
      finding(
        tier,
        `${rel}:${blockLine}`,
        "a statement has no `Effect`",
        [
          `at ${where}`,
          "`Effect` is what decides allow versus deny. Omitted, the statement is",
          "rejected by IAM rather than defaulted, and the error names the field",
          "nobody in the lesson mentioned.",
        ],
      );
    }
    if (hasAction && hasNotAction) {
      finding(
        tier,
        `${rel}:${blockLine}`,
        "a statement carries both `Action` and `NotAction`",
        [
          `at ${where}`,
          "One enumerates what is permitted, the other what is refused. A statement",
          "with both has no defined meaning, and the reader cannot tell which half",
          "the lesson intended.",
        ],
      );
    } else if (!hasAction && !hasNotAction) {
      finding(
        tier,
        `${rel}:${blockLine}`,
        "a statement has neither `Action` nor `NotAction`",
        [`at ${where}`, "Such a statement matches nothing, which reads as \"no access granted\"."],
      );
    }
  };

  let policyDocs = 0;
  let singleStatements = 0;
  let countedNotChecked = 0;

  for (const p of parsed) {
    if (isPolicyDoc(p.value)) {
      policyDocs++;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(p.value.Version)) {
        finding(
          tier,
          `${p.rel}:${p.line}`,
          `\`Version\` is \`${p.value.Version}\`, not the ISO date the IAM policy grammar defines`,
          ["IAM defines `Version` as a date, and the date is what selects the grammar."],
        );
      }
      p.value.Statement.forEach((s, i) =>
        checkStatement(s, `Statement[${i}]`, p.line, p.rel),
      );
    } else if (typeof p.value.Effect === "string" && !("if" in p.value)) {
      singleStatements++;
      checkStatement(p.value, "the statement", p.line, p.rel);
    } else if (isAzurePolicy(p.value)) {
      countedNotChecked++;
    } else {
      countedNotChecked++;
    }
  }

  const skippedWhy = [];
  if (countedNotChecked > 0) {
    skippedWhy.push(
      `${countedNotChecked} JSON block(s) are Azure Policy definitions or log event records — a different format with its own grammar, counted here and not shape-checked`,
    );
  }
  record(tier, {
    found: parsed.length,
    checked: policyDocs + singleStatements,
    skipped: countedNotChecked,
    why: skippedWhy,
  });
}

// === T0.3 — do two queries carrying the same declared identifier agree? ======
//
// This is the defect class the comprehension pass found by hand in cyber-10: a
// Wazuh rule that fired when the parent WAS the management tool, the inverse of
// the Sigma and SPL versions it was presented as equivalent to. One version of
// a rule disagreeing with its sibling is invisible to every other guard here,
// because each block is internally consistent and nothing in the corpus compared
// them.
//
// IT KEYS ONLY ON AN IDENTIFIER WRITTEN INSIDE THE BLOCK. That is a deliberate
// limit, and it was set by measurement rather than by taste. The corpus has
// exactly two groups presenting one rule in several notations, and a survey of
// both found:
//
//   - advance-02's HUNT-2026-021 group carries its id in two of its four
//     blocks. The SPL and the Sigma carry none, so a Sigma-vs-KQL comparison is
//     not available and this guard does not pretend to make one.
//   - cyber-10's encoded-PowerShell group is the one the prose calls "the same
//     rule, expressed in three platforms", and it carries NO identifier at all.
//     Its blocks are also fenced `text`, `text` and `xml` rather than `spl`,
//     `kql` and `wazuh`.
//
// So pairing those by proximity would mean guessing from how close two blocks
// sit under a heading. That is D-033's exact failure — a presence-based check
// whose pass path and skip path are the same shape — and this repository has
// been bitten by it four times. The honest move is to check what can be checked
// mechanically and REPORT the rest as uncovered, so the gap is visible rather
// than assumed closed. A convention that would close it is a content decision,
// not something a guard should invent on its own.
//
// The elements compared are the ones a reader would assume are shared: the set
// of binaries matched and the set of path fragments matched. Time windows and
// thresholds are excluded, for the reason at the `analyse` helper below.
//
// ONLY ONE DIRECTION IS REPORTED, and it was not the first version. The first
// version reported ANY divergence between a pair, and it produced four findings
// on a corpus with one real defect. Three of the four were a hunt's later stage
// being *broader* than its first: `advance-02:891` sweeps nine binaries where
// `:814` names none, because it answers a different question — "did any of them
// talk out?" rather than "which of them were used?". A wider stage catches
// everything the narrower one caught, so nothing is lost and there is nothing for
// a reader to be misled about.
//
// The defect is silence in the other direction. A later stage whose filter is a
// STRICT SUBSET of the earlier one cannot see a hit the earlier one returned, so
// a reader following the prose loses events between the two and is given no sign
// that it happened. So the rule is: report when the later block is a strict
// subset of the reference, and stay quiet otherwise.
//
// This is the difference between a report that says something and a report that
// cries wolf. Four findings that repeat on every run are a report people learn
// to scroll past, and then the fifth one — the genuine one — goes unread too.
// The credibility is the asset, and it is spent on nothing at the cost of one
// real defect going unnoticed. Measured effect: 4 findings became 1, and the 1
// is `advance-02:482`.
//
// A block may declare its divergence intentional with a `guard: independent
// filter` line. That is the same move `audit-sigma.mjs` makes for placeholders:
// an escape hatch that is written down, and which the coverage report counts, so
// it cannot be added silently to quiet a finding.

{
  const tier = "T0.3 same-identifier agreement";
  const QUERY_LANGS = new Set(["kql", "kusto", "spl", "sigma", "wazuh"]);

  // A declared hunt or rule id. Narrow on purpose: an over-broad pattern would
  // group unrelated blocks, and a group that pairs the wrong blocks is worse
  // than no group at all.
  const ID = /\bHUNT-\d{4}-\d{3}\b/;

  // Path roots worth comparing. Derived from the corpus's own stated hypothesis
  // rather than invented, and deliberately a closed list -- a guard that tries
  // to discover roots generalises into noise, and noise is how a guard gets
  // switched off. Backslashes are stripped before comparison so that
  // `\AppData\`, `\\AppData\\` and `/AppData/` are one value.
  const ROOTS = ["appdata", "temp", "downloads", "programdata", "userspublic", "system32", "windows"];

  const BINARY = /["']([\w.-]+\.(?:exe|dll|ps1|vbs|js|bat|cmd|scr|hta|sys))["']/gi;

  // TIME WINDOWS ARE DELIBERATELY NOT COMPARED, and the first version of this
  // guard compared them and was wrong.
  //
  // It reported `advance-02:482` as disagreeing with `:447` by "10m", which is
  // the second stage of a hunt *adding* the causal-gap bound the first stage
  // cannot express. That is the point of the second stage, and the phase
  // explains it in the sentence below the query. A stage that adds a time bound
  // is not a stage that matches different events, so window and threshold
  // comparison was measuring progression as though it were disagreement.
  //
  // What is compared is only what defines *which events are matched*: the binary
  // set and the path roots. Those are the elements a reader assumes are shared
  // when two blocks carry one identifier.

  const analyse = (body) => {
    const flat = body.replace(/\\/g, "").toLowerCase();
    const binaries = new Set();
    for (const m of body.matchAll(BINARY)) binaries.add(m[1].toLowerCase());
    const roots = new Set(ROOTS.filter((r) => flat.includes(r)));
    return { binaries, roots };
  };

  const setDiff = (a, b) => [...a].filter((x) => !b.has(x)).sort();

  // Group by identifier, across the whole corpus rather than within a file: a
  // rule converted for another platform legitimately lives in another phase.
  const groups = new Map();
  let queryBlocks = 0;
  let unidentified = 0;

  for (const c of corpus) {
    for (const b of c.blocks) {
      if (!QUERY_LANGS.has(b.lang) || b.unterminated) continue;
      queryBlocks++;
      const m = ID.exec(b.body.join("\n"));
      if (!m) {
        unidentified++;
        continue;
      }
      const key = m[0];
      if (!groups.has(key)) groups.set(key, []);
      const declared = b.body.some((l) => /guard:\s*independent filter/i.test(l));
      groups.get(key).push({ ...b, rel: c.rel, declared, ...analyse(b.body.join("\n")) });
    }
  }

  let comparedGroups = 0;
  for (const [id, blocks] of groups) {
    if (blocks.length < 2) continue;
    comparedGroups++;

    // The first block is the reference, and every later block is tested for
    // being NARROWER. With two blocks that is one direction; with more it is a
    // stated choice, and the reference is named in the finding so a reader can
    // judge it. A stage that is wider is not reported — see the header.
    const ref = blocks[0];
    for (const other of blocks.slice(1)) {
      if (other.declared || ref.declared) continue; // divergence declared intentional

      // A subset of the empty set is the empty set, so a reference that matches
      // nothing cannot be narrowed by anything. That is correct rather than a
      // special case: a stage with no filter of its own is not a filter a
      // reader can silently fall out of, and HUNT-2026-014's first block is
      // exactly that shape.
      const narrowed = (mine, theirs) =>
        mine.size > 0 && mine.size < theirs.size && [...mine].every((x) => theirs.has(x));
      const dropsBinaries = narrowed(other.binaries, ref.binaries);
      const dropsRoots = narrowed(other.roots, ref.roots);

      // Either element firing is enough: the two sets need not narrow together
      // for an event to fall out between the stages.
      if (!dropsBinaries && !dropsRoots) continue;

      const detail = [
        `identifier ${id}, comparing ${ref.rel}:${ref.line} (${ref.lang}) with ${other.rel}:${other.line} (${other.lang})`,
        "",
        "The second block matches a STRICT SUBSET of what the first matches, so an",
        "event the first returns can never reach the second. Nothing says so, and a",
        "reader following the prose loses it between the two stages.",
      ];
      if (dropsBinaries) {
        detail.push(
          `  binaries the first matches and the second does not:  ${setDiff(ref.binaries, other.binaries).join(", ")}`,
        );
      }
      if (dropsRoots) {
        detail.push(
          `  path roots the first matches and the second does not:  ${setDiff(ref.roots, other.roots).join(", ")}`,
        );
      }
      detail.push(
        "",
        "This is REPORTED, not failed, because whether a second stage is meant to be",
        "narrower is a judgement about the prose around it. A second stage that is",
        "WIDER is not reported at all — it loses nothing.",
      );

      finding(
        tier,
        `${other.rel}:${other.line}`,
        `query \`${id}\` is narrowed by a later stage matching a strict subset of the first`,
        detail,
        { gates: false },
      );
    }
  }

  const compared = [...groups.values()].filter((b) => b.length > 1).reduce((n, g) => n + (g.length - 1), 0);
  const why = [];
  if (unidentified > 0) {
    why.push(
      `${unidentified} query block(s) carry no declared identifier, so they cannot be paired without guessing from proximity — which is the D-033 failure, and D-033 is a negative result recorded precisely so nobody rebuilds it`,
    );
  }
  if (queryBlocks - unidentified > compared) {
    why.push(
      `${queryBlocks - unidentified - compared} identifier-bearing block(s) are in a group of one, so there is nothing to compare them against`,
    );
  }
  record(tier, {
    found: queryBlocks,
    checked: compared + 1,
    skipped: unidentified,
    why,
  });
}

// === T0.4 — do the shell-dialect blocks close what they open? ===============
//
// This tier is pure counting, so unlike the interpreter-backed ones it needs
// nothing installed and can gate in CI. It answers one narrow question: inside a
// block, do the brackets and quotes balance by the time the block ends?
//
// THREE RULES WERE SET BY MEASURING THE CORPUS, NOT BY CHOOSING THEM. Each was
// the opposite of what looks obvious, and each was found by a survey of every
// risky construct the corpus contains.
//
// 1. BALANCE IS CHECKED PER BLOCK, NEVER PER LINE.
//    Per-line checking is guaranteed to be red on day one. Six lines in this
//    corpus are individually odd and collectively correct, and every one of them
//    is a real lesson:
//      `advance-04:583`  opens a single-quoted JSON argument and a brace
//      `advance-04:592`  a bare `}` mid-document
//      `advance-04:593`  closes both
//      `advance-07:320`  opens a multi-line double-quoted string
//      `advance-01:251`  opens another one
//      `cyber-09:259`    opens a `$(` continued on the next line
//    A per-line checker fires on all six. State has to carry across lines
//    within a block and reset at the fence.
//
// 2. COMMENTS ARE RECOGNISED DURING THE SCAN, NOT STRIPPED BEFORE IT.
//    Stripping comments before parsing is wrong in BOTH directions, and this
//    corpus contains a block that proves each half.
//
//    Stripping them breaks `advance-01:1055`, `$field[$node.Name] = $node.'#text'`,
//    where the `#` is XML text inside a single-quoted string: truncate to the `#`
//    and you are left holding `$node.'`, one unpaired quote. That is the
//    argument for not stripping.
//
//    Not stripping them is equally wrong, and ten blocks prove it. Every one of
//    them is an ordinary English apostrophe inside a comment:
//      `it-03:1486`        # On Maria's PC
//      `cyber-09:246`      # The version id must be the policy's *default* version
//      `cyber-10:375`      # a command run through sudo still carries the caller's auid
//      `cyber-10:740`      # ... which also tests your rule's noise profile
//      `advance-05:375`    # Download Sysmon ... (SwiftOnSecurity's is a
//    Count the `'` and you are in-string for the rest of the block, and a block
//    that is perfectly balanced reports as broken. The first version of this
//    tier did exactly that and produced ten findings, all ten false.
//
//    The resolution is that a comment is a LEXICAL construct, not a deletion. A
//    single left-to-right pass that knows which quotes it is inside can tell
//    `$node.'#text'` (a `#` in a string — not a comment) from `# Maria's PC` (a
//    `#` in a comment — the `'` does not exist), and the two cases stop being a
//    trade-off. The order of the operations is the whole fix; neither stripping
//    nor ignoring would have found it.
//
//    Two more constructs are handled for the same reason rather than left as
//    traps: PowerShell's `<# ... #>` block comment (`cyber-12:861`) and bash's
//    rule that `#` only opens a comment at the start of a word, so `foo#bar` is
//    a literal. The corpus uses no `${#...}` length expansion, which is the one
//    place bash's rule is subtle, and the coverage note below says so rather
//    than pretending the counter is complete.
//
// 3. NO ESCAPE PROCESSING INSIDE QUOTES. Not backslash, not backtick.
//    `advance-07:809` contains `\{`, `\(`, `\[`; `cyber-09:263` contains `\*`
//    inside a single-quoted string where the backslash is literal; `cyber-09:670`
//    contains a backtick pair inside a single-quoted JMESPath argument. All three
//    balance as raw characters. An escape-aware tokenizer is strictly more likely
//    to mis-track them than a raw counter is, because in two of the three cases
//    the escape character carries no escaping meaning at all.
//
// This check counts and does not judge. It cannot tell a genuinely broken block
// from a correct one that uses a construct the counter has not seen, which is
// why the first thing to do with a finding here is read the block, not to assume
// the counter is right. A counter that cannot be wrong is not a counter.

const totalBlocks = corpus.reduce((n, c) => n + c.blocks.length, 0);

{
  const tier = "T0.4 shell bracket balance";

  // `pwsh`/`sh`/`python3` are included although the corpus uses none of them, so
  // that a block written for a shell the reader is more likely to have still
  // gets counted. `ps1` and `posh` are the labels a Windows author is most
  // likely to type instead of `powershell`, and a label outside this set opts
  // the block out of every check in this tier SILENTLY. The coverage table
  // prints the per-language totals below, so an unexpectedly small `powershell`
  // count is visible rather than inferred.
  const SHELL = new Set([
    "powershell", "pwsh", "ps1", "posh",
    "bash", "sh", "shell", "zsh", "shell-session",
    "python", "python3",
  ]);

  // bash is the odd one out: `#` only opens a comment at the beginning of a word,
  // so in a bash block a `#` glued to the previous character is literal text.
  // PowerShell and Python start a comment at any `#` outside a string.
  const wordStart = new Set(["bash", "sh", "shell", "zsh", "shell-session"]);

  const OPEN = { "{": "}", "(": ")", "[": "]" };
  const CLOSE = { "}": "{", ")": "(", "]": "[" };

  // A DATA frame is a run of lines that is text rather than code, and it exists
  // because the earlier version counted it as code. Both forms are
  // line-delimited, so both are detected at the END of the line that opens them
  // and the START of the line that closes them:
  //
  //   - PowerShell here-strings, `@"` … `"@` and `@'` … `'@` (zero in the corpus).
  //   - bash heredocs, `<<WORD` … `WORD` and `<<-WORD` … `WORD`, whose body may
  //     hold any quote or bracket because it is never tokenised.
  //
  // The corpus's one heredoc is a Markdown decision log, and it balances today
  // only because it happens to contain no brace or paren. It is prose and it
  // will grow prose, so one line of ordinary English would have turned the build
  // red on a correct file. The `-` in `<<-` is honoured because that is the one
  // form whose terminator may be indented with tabs.
  const HEREDOC = /<<(-)?\s*(?:'([^']*)'|"([^"]*)"|([A-Za-z_][A-Za-z0-9_]*))\s*$/;
  const HERESTRING = /@("|')\s*$/;

  const perLang = new Map();
  let checked = 0;
  let skipped = 0;
  const why = [];

  for (const c of corpus) {
    for (const b of c.blocks) {
      if (!SHELL.has(b.lang)) continue;
      perLang.set(b.lang, (perLang.get(b.lang) ?? 0) + 1);
      if (b.unterminated) {
        skipped++;
        continue;
      }

      checked++;
      const stack = [];
      let quote = null;
      let quoteAt = null;
      let blockComment = false;
      let blockCommentAt = null;

      // `$(` inside a PowerShell double-quoted string is CODE, not string. The
      // first version skipped every character once `quote` was set, so a dropped
      // `)` in `"$($x.Count"` was invisible. That is a false negative which was
      // LIVE rather than hypothetical: six such subexpressions exist in the
      // corpus today and all six happen to be balanced, PowerShell's own parser
      // rejects the broken form, and this tier said nothing. `sub` is the nesting
      // depth inside the outer string; `subQuote` is a string opened within it.
      let sub = 0;
      let subAt = null;
      let subQuote = null;

      // A DATA frame, when set, causes whole lines to be skipped as text.
      let data = null;
      let dataAt = null;

      // The shared bracket bookkeeping, so the subexpression path below cannot
      // drift away from the main path. Kept in one place for that reason alone.
      const bracket = (ch, at) => {
        if (OPEN[ch]) stack.push({ ch, at });
        else if (CLOSE[ch]) {
          const top = stack[stack.length - 1];
          if (!top) {
            // A closer with nothing open. Reported at its own line, because
            // "extra `}` on line 593" is a different defect from "nothing
            // balances by the end of the block" and the line is the useful part.
            stack.push({ ch, at, orphan: true });
          } else if (top.ch !== CLOSE[ch]) {
            stack.push({
              ch,
              at,
              mismatch: `closes with \`${ch}\` while \`${top.ch}\` opened on line ${top.at} is still open`,
            });
          } else {
            stack.pop();
          }
        }
      };

      for (let i = 0; i < b.body.length; i++) {
        const line = b.body[i];
        const at = b.line + 1 + i;

        // A DATA frame skips the line wholesale, quotes and brackets included,
        // because that is the whole point: its contents are never tokenised.
        if (data) {
          const probe = data.dash ? line.replace(/^\t+/, "") : line;
          if (probe === data.end || probe.trim() === data.end) data = null;
          continue;
        }

        for (let j = 0; j < line.length; j++) {
          const ch = line[j];

          if (blockComment) {
            if (ch === "#" && line[j + 1] === ">") {
              blockComment = false;
              j++;
            }
            continue;
          }

          // Code running inside a PowerShell double-quoted string, entered via
          // `$(`. Brackets balance normally here, and a quote opens a NESTED
          // string rather than closing the outer one.
          if (sub > 0) {
            if (subQuote) {
              if (ch === subQuote) subQuote = null;
            } else if (ch === '"' || ch === "'") {
              subQuote = ch;
            } else if (ch === "$" && line[j + 1] === "(") {
              sub++;
              j++;
            } else if (ch === "(") {
              sub++;
            } else if (ch === ")") {
              sub--;
              if (sub === 0) subAt = null;
            } else if (ch === "#" && !wordStart.has(b.lang)) {
              break; // rest of line is a comment
            } else {
              bracket(ch, at);
            }
            continue;
          }

          if (quote) {
            if (quote === '"' && ch === "$" && line[j + 1] === "(") {
              sub = 1;
              subAt = at;
              j++;
              continue;
            }
            if (ch === quote) {
              quote = null;
              quoteAt = null;
            }
            continue;
          }

          if (ch === "<" && line[j + 1] === "#") {
            blockComment = true;
            blockCommentAt = at;
            j++;
            continue;
          }
          if (ch === "#") {
            const prev = j === 0 ? " " : line[j - 1];
            if (!wordStart.has(b.lang) || /\s/.test(prev)) break; // rest of line is a comment
            continue; // `foo#bar` in bash: literal
          }
          if (ch === '"' || ch === "'") {
            quote = ch;
            quoteAt = at;
            continue;
          }
          bracket(ch, at);
        }

        // A DATA frame is only opened by a line that finished outside any
        // string and outside any block comment, so a `@"` appearing in prose
        // inside a quoted string cannot open one.
        if (data || quote || blockComment) continue;
        const hs = HERESTRING.exec(line);
        if (hs && !wordStart.has(b.lang)) {
          data = { end: hs[1] + "@", dash: false };
          dataAt = at;
          continue;
        }
        const hd = wordStart.has(b.lang) ? HEREDOC.exec(line) : null;
        if (hd) {
          const end = hd[2] ?? hd[3] ?? hd[4];
          if (end) {
            data = { end, dash: Boolean(hd[1]) };
            dataAt = at;
          }
        }
      }

      const detail = [];
      for (const s of stack) {
        if (s.mismatch) detail.push(`  line ${s.at}: ${s.mismatch}`);
        else if (s.orphan) detail.push(`  line ${s.at}: \`${s.ch}\` closes a bracket that was never opened`);
        else detail.push(`  line ${s.at}: \`${s.ch}\` is never closed`);
      }
      if (quote) detail.push(`  line ${quoteAt}: a ${quote === '"' ? "double" : "single"} quote is never closed`);
      if (sub > 0) {
        detail.push(`  line ${subAt}: a \`$(\` subexpression inside a double-quoted string is never closed by \`)\``);
      }
      if (blockComment) {
        detail.push(`  line ${blockCommentAt}: a \`<#\` block comment is never closed by \`#>\``);
      }
      if (data) {
        detail.push(`  line ${dataAt}: this DATA region is never closed by a line reading \`${data.end}\``);
      }

      if (!detail.length) continue;

      detail.push(
        "",
        "The brackets or quotes in this block do not balance by the time the block ends.",
        "",
        "Read the block before assuming the counter is right. This tier counts delimiters",
        "and does not parse the language, so a construct it has not seen can look broken",
        "while being correct. The rules it follows — per-block not per-line, comments",
        "recognised during the scan rather than stripped before it, DATA regions skipped",
        "rather than counted, no escape processing — are documented above this check, and",
        "the reasoning is in docs/DECISIONS.md.",
      );

      const openCount =
        stack.length + (quote ? 1 : 0) + (sub > 0 ? 1 : 0) + (blockComment ? 1 : 0) + (data ? 1 : 0);

      finding(
        tier,
        `${c.rel}:${b.line}`,
        `a ${b.lang} block does not balance: ${openCount} delimiter(s) left open`,
        detail,
      );
    }
  }

  if (skipped > 0) {
    why.push(
      `${skipped} shell block(s) sit in an unterminated fence, so their contents cannot be delimited from the rest of the file and were not counted`,
    );
  }
  why.push(
    `counted per block, not per line, across ${[...perLang].map(([k, v]) => `${v} ${k}`).join(", ")} — six individually-odd lines in this corpus are collectively correct and are why per-line checking is not done`,
  );
  // CORRECTED 2026-09-29 after an independent verification pass. This note used
  // to say the corpus "contains no `${#...}` length expansion, which is the one
  // construct that would make that rule wrong". That was wrong in both halves,
  // and it is recorded here rather than deleted because the error is the useful
  // part: `${#var}` is handled CORRECTLY by the word-start rule, since the `{`
  // follows `#` immediately and the rule keys on the character BEFORE the `#`.
  // What would actually break the rule is a `#` glued to a non-space character
  // inside what a reader would call a comment — `echo a#b` is genuinely literal
  // in bash and this guard genuinely counts it as code, which is right.
  why.push(
    "bash `#` opens a comment only at the start of a word, so `foo#bar` is counted as literal code. The corpus contains no `${#...}`, `case`/`esac` or `$'...'` construct, and each of those was checked against the rule by hand rather than assumed",
  );

  // The label is the ONLY thing that gets a block into this tier, and a label
  // outside the set opts out silently. That is a real surface rather than a
  // hypothetical one: `it-05:1122` held real PowerShell under a ```text fence
  // and was therefore scanned by NOTHING in this guard until the fence was
  // relabelled. The count below is how much of the corpus is outside the set.
  const notShell = totalBlocks - checked - skipped;
  why.push(
    `${notShell} of ${totalBlocks} block(s) carry a fence label outside the shell set and are NOT balance-checked — the label is the only thing that admits a block here, so PowerShell under a \`\`\`text fence is invisible until someone relabels it`,
  );

  record(tier, { found: checked + skipped, checked, skipped, why });
}

// --- the report -------------------------------------------------------------

console.log("Code inside the lessons — does it parse, and is it shaped like what it claims to be?");
console.log("=".repeat(78));
// Not "phase files" — it is no longer only phases. It is every Markdown file
// under `career-roadmaps/`, and the number is asserted by the control suite, so
// narrowing this list fails a test rather than quietly shrinking the denominator.
console.log(`markdown files read    : ${corpus.length}`);
console.log(`fenced blocks found    : ${totalBlocks}`);
console.log("");
console.log("blocks by language");
for (const [lang, n] of [...byLang].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(4)}  ${lang}`);
}

console.log("");
console.log("coverage by tier");
for (const [tier, c] of coverage) {
  const parts = [`${c.checked} of ${c.found} checked`];
  if (c.skipped) parts.push(`${c.skipped} skipped`);
  console.log(`  ${tier.padEnd(30)} ${parts.join(", ")}`);
  for (const why of [...new Set(c.why)]) console.log(`      not checked: ${why}`);
}

console.log("");
console.log("not checked by this guard, and not by any other");
console.log("  These are real blind spots, listed here so that a green run above cannot be read");
console.log("  as more than it is. Each was considered and not built; the reason is given.");
console.log("");
console.log("  - Whether a python block COMPILES. T0.4 counts its delimiters, which catches");
console.log("    an unclosed bracket and nothing else. `python -m py_compile` would catch a");
console.log("    syntax error, but no `python` exists on a default Windows install and");
console.log("    `scripts/` may not take a dependency (AGENTS.md rule 3), so there is nothing");
console.log("    to call. 28 blocks are affected. NOT BUILT rather than built untested: a tier");
console.log("    that has never been executed is a guess, and a guard that is wrong in an");
console.log("    untested path is worse than an admitted gap.");
console.log("  - The same for powershell (163 blocks) and bash (86), via `pwsh` and `bash -n`.");
console.log("  - Whether a block RUNS, as opposed to parsing. The comprehension pass found");
console.log("    cyber-12 printing a name that is defined nowhere — a real defect, found by");
console.log("    reading, and still not caught by anything. Running a lesson's code means");
console.log("    running attacker techniques, which is why it is not something CI should do.");
console.log("  - Whether a query is a GOOD detection, or returns the right rows. This is the");
console.log("    repository's real boundary and it is D-036's; see the header comment.");
console.log("");

const gating = findings.filter((f) => f.gates);
const reported = findings.filter((f) => !f.gates);
const unchecked = [...coverage.values()].some((c) => c.skipped > 0);

const printFinding = (f) => {
  console.log(`  [${f.tier}] ${f.where}`);
  console.log(`    ${f.message}`);
  for (const line of f.detail) console.log(`      ${line}`);
  console.log("");
};

if (gating.length) {
  console.log(`${gating.length} finding(s) that fail the build:`);
  console.log("");
  for (const f of gating) printFinding(f);
}

if (reported.length) {
  console.log(`${reported.length} reported for a reader — NOT failures, and they do not affect the exit code:`);
  console.log("");
  if (reported.some((f) => f.tier === "T0.3 same-identifier agreement")) {
    console.log("  WHY ONE DIRECTION ONLY, and why these are not failures. Both are the");
    console.log("  load-bearing decisions in this file.");
    console.log("");
    console.log("  A shared `HUNT-` identifier marks a *hunt*, and a hunt spans queries that ask");
    console.log("  different questions. `advance-02:891` sweeps nine binaries where `:814` names");
    console.log("  none — it answers \"did any of them talk out?\", not \"which were used?\" — so it is");
    console.log("  WIDER, and a wider stage loses nothing. Reporting it would have been noise.");
    console.log("");
    console.log("  The defect is the other direction, and it is what is printed: a later stage whose");
    console.log("  filter is a strict SUBSET of an earlier one, so a hit the first query returns can");
    console.log("  never reach the second, with nothing in the text saying so. An earlier version of");
    console.log("  this check reported any difference at all and produced four findings for one real");
    console.log("  defect; a report that repeats itself on every run is one people learn to skip, and");
    console.log("  then the next genuine finding is skipped with it. Narrowing the rule to the one")
    console.log("  direction that loses events took it from four to one, and the one is real.");
    console.log("");
    console.log("  It is not a failure because whether a second stage is *meant* to be narrower is a");
    console.log("  judgement about the prose around it, and that is a reader's job.");
    console.log("");
  }
  for (const f of reported) printFinding(f);
}

if (!gating.length) {
  if (reported.length) {
    console.log(
      "OK — nothing that can be decided mechanically. Read the coverage table and the",
      "reported section above before treating that as a clean result; both are part of it.",
    );
  } else {
    console.log("OK — nothing found in the tiers that ran.");
  }
  if (unchecked) {
    console.log("");
    console.log("Read the coverage table before reading that line. A block the tools could");
    console.log("not reach was NOT checked, and an unchecked block is not a clean one.");
  }
  process.exit(0);
}

if (REPORT_ONLY) {
  console.log("--report: findings printed, exit 0 by request. This is a measurement, not a pass.");
  process.exit(0);
}
process.exit(1);
