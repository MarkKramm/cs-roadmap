// Control for the new empty-verdict check: prove it fires on the historical bug.
//
// Install the exact condition that existed for five passes -- "DNS record types"
// marked done while its rows are empty -- and require the guard to fail. A guard
// that has never been shown to fail on the real defect is not evidence (D-049).
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const GUARD = "scripts/audit-verdict-counts.mjs";
const DOC = "docs/CYBER-CLAIM-VERIFICATION.md";
const SPLIT = "scripts/split-claims.mjs";

// WHY EVERY FIXTURE NOW RUNS IN A TEMP TREE
//
// The first version of this suite mutated the REAL documents and restored them at the
// end. That is unsafe in a way that actually bit: a fixture wrote "control fixture"
// verdicts into three rows of docs/CYBER-CLAIM-VERIFICATION.md, the restore did not put
// them back, and the corruption sat in the working tree looking exactly like recorded
// verification. **A control suite that can leave fabricated verdicts in a verification
// document is worse than no control suite**, because the whole value of that document is
// that every 'OK' in it came from a verifier.
//
// So the guard now runs against COPIES. Each copy keeps the same relative paths the guard
// expects, and the real tree is never written to at all -- there is nothing to restore,
// so there is nothing to fail to restore.
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "verdict-counts-"));
const DOCS = path.join(TMP, "docs");
const SCRIPTS = path.join(TMP, "scripts");
fs.mkdirSync(DOCS, { recursive: true });
fs.mkdirSync(SCRIPTS, { recursive: true });

const CYBER_DOC = "docs/CYBER-CLAIM-VERIFICATION.md";
const IT_DOC = "docs/IT-CLAIM-VERIFICATION.md";
for (const f of [CYBER_DOC, IT_DOC]) fs.copyFileSync(f, path.join(TMP, f));
fs.copyFileSync(SPLIT, path.join(TMP, SPLIT));
// The guard is copied in too, so `node scripts/audit-verdict-counts.mjs` inside TMP
// resolves to the real guard without needing the rest of the repository.
fs.copyFileSync(GUARD, path.join(TMP, GUARD));

const orig = fs.readFileSync(path.join(TMP, CYBER_DOC), "utf8");
const itOrig = fs.readFileSync(path.join(TMP, IT_DOC), "utf8");
const splitOrig = fs.readFileSync(path.join(TMP, SPLIT), "utf8");
const realOrig = {
  [CYBER_DOC]: fs.readFileSync(CYBER_DOC, "utf8"),
  [IT_DOC]: fs.readFileSync(IT_DOC, "utf8"),
  [SPLIT]: fs.readFileSync(SPLIT, "utf8"),
};
let fails = 0;

const writeTmp = (rel, text) => fs.writeFileSync(path.join(TMP, rel), text, "utf8");
const readTmp = (rel) => fs.readFileSync(path.join(TMP, rel), "utf8");

// One raw guard run in the temp tree, no reconciliation.
const runGuardRaw = (args = [GUARD]) => {
  try {
    return execFileSync("node", args, { encoding: "utf8", cwd: TMP });
  } catch (e) {
    return (e.stdout || "") + (e.stderr || "");
  }
};

// Run the guard with an optional mutation to split-claims.mjs too, since the
// guard's verdict depends on which classes the splitter marks done.
const check = (name, wantFail, mutate, mutateSplit) => {
  writeTmp(CYBER_DOC, mutate(orig));
  writeTmp(SPLIT, mutateSplit ? mutateSplit(splitOrig) : splitOrig);
  let failed = false, out = "";
  try {
    out = execFileSync("node", [GUARD], { encoding: "utf8", cwd: TMP });
  } catch (e) {
    failed = true;
    out = (e.stdout || "") + (e.stderr || "");
  }
  const ok = failed === wantFail;
  if (!ok) fails++;
  console.log(`  ${ok ? "pass" : "FAIL"}  ${name}  (expected ${wantFail ? "exit!=0" : "exit=0"}, got ${failed ? "exit!=0" : "exit=0"})`);
  const line = out.split("\n").find((l) => l.includes("EMPTY verdict") || l.includes("OUTSTANDING") || l.includes("ABSENT"));
  if (line) console.log(`          -> ${line.trim().slice(0, 130)}`);
};

// A control that changes the DOCUMENT's rows also changes the totals the document
// publishes, so the guard's arithmetic check fires as well as the check under test.
// Rather than hardcode the resulting figures -- which was wrong twice and produced red
// lights against working code -- ask the guard what it derives and write those figures
// back. Each control then isolates ONE property: with the arithmetic settled, the only
// thing left able to fail is the check the control is actually about.
//
// This is the general fix for a real hazard of mutation testing: a fixture that alters
// state has side effects on every OTHER check, and a control that cannot tell "the
// guard is wrong" from "my fixture disturbed something else" is worse than no control.
const reconcile = (args, docPath, apply) => {
  let out = "";
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return execFileSync("node", args, { encoding: "utf8" });
    } catch (e) {
      out = (e.stdout || "") + (e.stderr || "");
    }
    // STOP IF THE FAILURE IS NOT PURELY ARITHMETIC.
    //
    // This loop exists to silence the arithmetic complaint a row-mutating fixture
    // creates. But the empty-verdict check also produces a Total mismatch (empty rows
    // move out of the completed-class totals), so a naive loop keeps rewriting the
    // published figures and re-running until the guard eventually passes -- silently
    // erasing the very defect the control installed. That is why control 5 reported
    // "expected FAIL, got PASS" against a working guard.
    //
    // If anything other than the arithmetic is wrong, stop and hand the output back.
    const nonArithmetic = out
      .split("\n")
      .filter((l) => /^\s+- /.test(l))
      .filter((l) => !/Total:|distinct-locations/.test(l));
    if (nonArithmetic.length) return out;

    const d = /\| \*\*Total[^|]*\*\* \| \*\*(\d+)\*\* \| \*\*(\d+)\*\* \| \*\*(\d+)\*\* \| \*\*(\d+)\*\* \|/.exec(out);
    if (!d) return out;
    const [, total, ok, wrong, unv] = d.map(Number);
    // The guard prints e.g. "distinct-locations label says A rows / B locations, derived
    // C / D" -- we want D, the derived LOCATION count, which is the LAST number.
    const dm = /derived (\d+) \/ (\d+)/.exec(out);
    fs.writeFileSync(
      docPath,
      apply(fs.readFileSync(docPath, "utf8"), { total, ok, wrong, unv, loc: dm ? dm[2] : null }),
      "utf8",
    );
  }
  try {
    return execFileSync("node", args, { encoding: "utf8" });
  } catch (e) {
    return (e.stdout || "") + (e.stderr || "");
  }
};

console.log("controls for the EMPTY-verdict check:");
console.log("  (the DNS class is real, tracked, outstanding work — these controls move it in and out of that state)");

const fillDns = (t) => {
  const i = t.indexOf("## DNS record types");
  const j = t.indexOf("\n## ", i + 1);
  const seg = t.slice(i, j === -1 ? t.length : j);
  const filled = seg.replace(/(\| \d+ \|[^|]*\|[^|]*\|)\s*\|/g, "$1 **UNVERIFIABLE** — control fixture |");
  return t.slice(0, i) + filled + t.slice(j === -1 ? t.length : j);
};
// The splitter now carries BOTH tracks, and "DNS record types" appears in each.
// A track-blind regex matches the IT entry first and silently mutates the wrong
// track -- which is how control 3 became a no-op that passed while proving nothing.
// Anchor every mutation inside the cybersec array.
const CYBER_START = "cybersec: [";
const inCyber = (s, fn) => {
  const i = s.indexOf(CYBER_START);
  if (i === -1) throw new Error("no cybersec class list in split-claims.mjs");
  const j = s.indexOf("\n  ],", i);
  const end = j === -1 ? s.length : j;
  return s.slice(0, i) + fn(s.slice(i, end)) + s.slice(end);
};
const markDnsDone = (s) =>
  inCyber(s, (seg) =>
    seg.replace(/\{ title: "DNS record types" \}/, '{ title: "DNS record types", done: true, doneThrough: 3 }'),
  );
const untrackDns = (s) => inCyber(s, (seg) => seg.replace(/\n\s*\{ title: "DNS record types" \},/, ""));

// 1. THE REAL BUG, EXACTLY AS IT SHIPPED. DNS is marked done in the splitter while
//    its rows carry no verdict -- the state the repository was actually in, which
//    five completed passes reported as clean.
check("DNS marked DONE but rows empty -> must FAIL", true, (t) => t, (s) => {
  const mutated = markDnsDone(s);
  if (mutated === s) throw new Error("control 1 fixture did not mutate split-claims.mjs");
  return mutated;
});

// 2. The correct in-flight state: DNS is outstanding AND its pack exists. The guard
//    must NOT fail, or it would be unusable during the very period it is needed.
check("DNS tracked as outstanding -> must PASS", false, (t) => t);

// 3. A class that is neither done nor tracked is unreachable work. Emptied and
//    unlisted, it must fail -- this is the "forgot to list it" case.
//
//    Assert the mutation actually happened before asserting the guard's verdict.
//    The previous version used a regex that no longer matched after the splitter
//    was restructured, so it silently mutated NOTHING, the guard correctly passed,
//    and the control reported a failure against working code. **A control that
//    cannot tell "the guard is wrong" from "my fixture is wrong" wastes exactly the
//    time it was built to save.**
check("empty rows in an untracked class -> must FAIL", true, (t) => t, (s) => {
  const mutated = untrackDns(s);
  if (mutated === s) throw new Error("control 3 fixture did not mutate split-claims.mjs");
  return mutated;
});

// 3b. A class DELETED from the splitter while its rows still exist. This is the
//     failure I committed while writing this guard: an edit to the IT block also
//     removed the cyber `{ title: "DNS record types" }` entry, which deleted the last
//     outstanding cyber work. Every other check passed, because a class that is not
//     in the list is not in the totals, and the guard went on printing it as tracked.
//
//     It is worse than an unverified class: an unverified class is at least counted
//     as outstanding. This one is invisible.
check("class deleted from the splitter -> must FAIL", true, (t) => t, (s) => {
  const mutated = inCyber(s, (seg) => seg.replace(/\n\s*\{ title: "DNS record types" \},/, ""));
  if (mutated === s) throw new Error("control 3b fixture did not mutate split-claims.mjs");
  return mutated;
});
//
//    Filling the rows also changes the totals the document publishes, so a naive
//    fixture trips the ARITHMETIC check and the control goes red against working code.
//    That is not a guard bug -- it is the guard correctly noticing that a document
//    whose rows changed still prints the old totals. So the fixture fills the rows and
//    then reconciles the published figures with the guard's own derived numbers,
//    leaving the empty-verdict check as the only thing under test.
const settleCyber = (t, d) =>
  t
    .replace(
      /\| \*\*Total\*\* \| \*\*\d+\*\* \| \*\*\d+\*\* \| \*\*\d+\*\* \| \*\*\d+\*\* \|/,
      `| **Total** | **${d.total}** | **${d.ok}** | **${d.wrong}** | **${d.unv}** |`,
    )
    .replace(/\*\*\d+ distinct\s+locations fill \d+ rows\.\*\*/, `**${d.loc} distinct locations fill ${d.total} rows.**`);

const checkReconciled = (name, wantFail, mutate, mutateSplit) => {
  writeTmp(CYBER_DOC, mutate(orig));
  writeTmp(SPLIT, mutateSplit ? mutateSplit(splitOrig) : splitOrig);
  const out = reconcile([GUARD], path.join(TMP, CYBER_DOC), settleCyber);
  const failed = /MISMATCH —/.test(out);
  const ok = failed === wantFail;
  if (!ok) fails++;
  console.log(`  ${ok ? "pass" : "FAIL"}  ${name}  (expected ${wantFail ? "exit!=0" : "exit=0"}, got ${failed ? "exit!=0" : "exit=0"})`);
};

checkReconciled("all rows answered, DNS marked done -> must PASS", false, fillDns, markDnsDone);
checkReconciled("all rows answered, DNS outstanding -> must PASS", false, fillDns);

// =====================================================================
// CONTROLS FOR THE IT TRACK
//
// The guard now reads both documents. The IT track is the one this check was
// invented for: it published a "verified" header over 225 empty rows for sixteen
// days and NOTHING checked it, because the guard only ever opened the cyber
// document. These controls install the same defect in the IT document and require
// the guard to catch it there too -- a guard that only protects the track it was
// written for is how the other track got into that state.
// =====================================================================
const GUARD_IT = [GUARD, "--track", "it"];

const checkIt = (name, wantFail, mutateIt, mutateSplit) => {
  writeTmp(IT_DOC, mutateIt(itOrig));
  writeTmp(SPLIT, mutateSplit ? mutateSplit(splitOrig) : splitOrig);
  let failed = false, out = "";
  try {
    out = execFileSync("node", GUARD_IT, { encoding: "utf8", cwd: TMP });
  } catch (e) {
    failed = true;
    out = (e.stdout || "") + (e.stderr || "");
  }
  const ok = failed === wantFail;
  if (!ok) fails++;
  console.log(`  ${ok ? "pass" : "FAIL"}  ${name}  (expected ${wantFail ? "exit!=0" : "exit=0"}, got ${failed ? "exit!=0" : "exit=0"})`);
  const line = out.split("\n").find((l) => l.includes("EMPTY verdict") || l.includes("OUTSTANDING") || l.includes("ABSENT"));
  if (line) console.log(`          -> ${line.trim().slice(0, 130)}`);
};

// A control that mutates the DOCUMENT's rows changes the totals the document
// publishes, so the guard's arithmetic check fires as well as the check under test.
// Rather than hardcode the new totals -- which failed twice and produced red lights
// against working code -- ask the guard what it derives, and write those numbers back.
//
// This keeps each control isolating ONE property: after the fixture settles the
// arithmetic, the only thing left that can fail is the empty-verdict check.
const IT_START = "it: [";
const inIt = (s, fn) => {
  const i = s.indexOf(IT_START);
  if (i === -1) throw new Error("no it class list in split-claims.mjs");
  const j = s.indexOf("\n  ],", i);
  const end = j === -1 ? s.length : j;
  return s.slice(0, i) + fn(s.slice(i, end)) + s.slice(end);
};

// Empty the IT DNS class's verdict column, the way it sat for sixteen days.
const emptyItDns = (t) => {
  const i = t.indexOf("## DNS record types");
  if (i === -1) throw new Error("no DNS section in the IT document");
  const j = t.indexOf("\n## ", i + 1);
  const seg = t.slice(i, j === -1 ? t.length : j);
  const stripped = seg.replace(/(\| \d+ \|[^|]*\|[^|]*\|) \*\*(OK|WRONG|UNVERIFIABLE)\*\*[^|]*\|/g, "$1 |");
  if (stripped === seg) throw new Error("IT DNS fixture did not mutate the document");
  return t.slice(0, i) + stripped + t.slice(j === -1 ? t.length : j);
};

console.log("");
console.log("controls for the IT track (the document the guard used to ignore):");

// Emptying the IT DNS rows changes the published totals, so the fixture reconciles
// them with the guard's derived figures. Only the empty-verdict check is under test.
// ONLY THE TOTAL IS RECONCILED. The DNS summary row is deliberately left alone:
// rewriting it from the guard's derived figure would paper over the very inconsistency
// the control is testing, and the control passed for exactly that reason. A fixture must
// not "fix" the defect it just installed.
const settleIt = (t, d) =>
  t.replace(
    /\| \*\*Total — \d+ rows over \d+ distinct locations\*\* \| \*\*\d+\*\* \| \*\*\d+\*\* \| \*\*\d+\*\* \| \*\*\d+\*\* \|/,
    `| **Total — ${d.total} rows over ${d.loc} distinct locations** | **${d.total}** | **${d.ok}** | **${d.wrong}** | **${d.unv}** |`,
  );

const checkItReconciled = (name, wantFail, mutateIt, mutateSplit) => {
  const docMutated = mutateIt(itOrig);
  if (docMutated === itOrig) throw new Error(`fixture for "${name}" did not mutate the IT document`);
  writeTmp(IT_DOC, docMutated);
  writeTmp(SPLIT, mutateSplit ? mutateSplit(splitOrig) : splitOrig);
  // Reconcile ONLY for controls that expect the guard to PASS. A failure-expecting
  // control wants the guard's raw verdict; running the arithmetic loop first would
  // rewrite the published figures and can leave a state the guard is happy with,
  // which is precisely how this control kept reporting success for a defect that was
  // still installed.
  const out = wantFail
    ? runGuardRaw(GUARD_IT)
    : reconcile(GUARD_IT, path.join(TMP, IT_DOC), settleIt);
  const failed = /MISMATCH —/.test(out);
  const ok = failed === wantFail;
  if (!ok) fails++;
  console.log(`  ${ok ? "pass" : "FAIL"}  ${name}  (expected ${wantFail ? "exit!=0" : "exit=0"}, got ${failed ? "exit!=0" : "exit=0"})`);
  if (process.env.DBG) console.log("      guard said:\n" + out.split("\n").map((l) => "        " + l).join("\n"));
};

// 5. THE HISTORICAL DEFECT, installed in the IT document: rows empty AND the class
//    still marked done. That combination is unreachable work -- nothing will ever be
//    sent to a verifier, and no total will ever count it -- and it is exactly the state
//    the IT track sat in for sixteen days while its header claimed success.
//
//    This control does NOT reconcile the published totals. It wants the guard's raw
//    verdict on a document whose rows and figures disagree, and reconciliation exists
//    only to stop row-mutating PASS-controls tripping the arithmetic check. Verified
//    independently: on this exact state the guard reports
//      section "DNS record types" has 4 row(s) with an EMPTY verdict column
//      (and it is listed as done!)
checkItReconciled("IT: DNS rows empty while the class is DONE -> must FAIL", true, emptyItDns);

// 6. In-flight is legitimate: rows empty, class NOT done, and the summary row updated to
//    match. Must pass. (Control 5 leaves the summary row stale on purpose -- see above.)
checkItReconciled(
  "IT: DNS rows empty and tracked outstanding -> must PASS",
  false,
  (t) => emptyItDns(t).replace(/\| DNS record types \| 4 \| \d+ \| \*\*0\*\* \| \d+ \|/, "| DNS record types | 4 | 0 | **0** | 4 |"),
  (s) => {
    const mutated = inIt(s, (seg) =>
      seg.replace(/\{ title: "DNS record types", done: true, doneThrough: 4 \}/, '{ title: "DNS record types" }'),
    );
    if (mutated === s) throw new Error("control 6 fixture did not mutate split-claims.mjs");
    return mutated;
  },
);

// 7. Negative control: the real, unmutated IT document must pass. If this fails the
//    guard is wrong about the track, not the other way round.
checkIt("IT: the document as shipped -> must PASS", false, (t) => t);

// 8. A published figure that disagrees with the rows must fail. This is the check
//    that would have caught the "224 claims, 0 WRONG" header mechanically.
checkIt("IT: total row disagrees with the rows -> must FAIL", true, (t) => {
  const mutated = t.replace(
    "| **Total — 225 rows over 220 distinct locations** | **225** | **208** | **0** | **17** |",
    "| **Total — 225 rows over 220 distinct locations** | **225** | **999** | **0** | **17** |",
  );
  if (mutated === t) throw new Error("control 8 fixture did not mutate the IT total row");
  return mutated;
});

// THE REAL TREE MUST BE UNTOUCHED. Every fixture above ran against copies, so this
// compares the actual repository files against what they were when the suite started.
// It is the check whose absence let a fixture write "control fixture" verdicts into
// three rows of the real cyber document, where they looked exactly like verification.
const untouched = Object.entries(realOrig).every(([rel, text]) => fs.readFileSync(rel, "utf8") === text);
fs.rmSync(TMP, { recursive: true, force: true });
console.log("");
console.log(`  real repository files untouched by every fixture: ${untouched}`);
if (!untouched) {
  console.log("  !! A fixture wrote to the REAL tree. Fixtures must run in the temp copy.");
}
console.log(fails === 0 && untouched ? "ALL CONTROLS PASS" : `${fails} CONTROL(S) FAILED`);
process.exit(fails === 0 && untouched ? 0 : 1);
