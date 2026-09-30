// Controls for audit-build-figures.mjs.
//
// WHY THIS SUITE IS SMALLER THAN THE OTHERS. The guard reads `dist/` and one
// document, so there is very little to get wrong -- but "very little" is
// exactly what a guard asserts about itself, and a check that has never been
// shown to fail is a check nobody has tested. Every control here plants a
// condition and requires the guard to NOTICE, plus two that require it to stay
// quiet, because a guard that fails on everything is a guard that gets switched
// off.
//
// The document is restored by rewriting the ORIGINAL text forward rather than
// with `git checkout`, and that is deliberate: an earlier session mutated a file
// and then restored it with checkout, which silently reverted an uncommitted fix
// that lived in the same file. Restoring forward cannot lose work.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = process.cwd();
const GUARD = "scripts/audit-build-figures.mjs";
const DOC_PATH = path.join(ROOT, "docs", "CHECKPOINT.md");
const DIST = path.join(ROOT, "learning-site", "dist");
const ASSETS = path.join(DIST, "assets");

// --- preconditions -----------------------------------------------------------
// A control suite for a guard that needs a build is a control suite that must
// refuse to run without one, rather than reporting a pass because the guard
// exited 1 for the wrong reason.
if (!fs.existsSync(ASSETS)) {
  console.error(
    "PRECONDITION FAILED — these controls need a completed `npm run build` in learning-site/.\n" +
      "  Without dist/ the guard exits 1 on 'BUILD OUTPUT MISSING', and every control would\n" +
      "  'pass' for the wrong reason. That is the exact hazard this suite exists to prevent.",
  );
  process.exit(1);
}

const original = fs.readFileSync(DOC_PATH, "utf8");
const results = [];

function run() {
  try {
    const out = execFileSync("node", [GUARD], { encoding: "utf8", cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] });
    return { code: 0, out };
  } catch (e) {
    return { code: e.status === undefined ? -1 : e.status, out: (e.stdout || "") + (e.stderr || "") };
  }
}

function writeDoc(text) {
  fs.writeFileSync(DOC_PATH, text, "utf8");
}

/**
 * Both helpers REQUIRE THAT THE MUTATION ACTUALLY CHANGED THE FILE.
 *
 * Without that, a `mutate` whose search string no longer exists is a silent
 * no-op, the document is left untouched, and a `mustPass` control reports
 * success while testing nothing at all. That is a control that cannot fail —
 * the same defect as a guard that cannot fail, one level up. It was found by an
 * adversarial pass that renamed the `## Health checks` heading the control
 * anchored on: the suite still reported ALL CONTROLS PASS.
 */
const applyMutation = (mutate) => {
  const before = fs.readFileSync(DOC_PATH, "utf8");
  const after = mutate(before);
  if (typeof after !== "string") {
    throw new Error("a mutate function returned " + typeof after + ", not a string");
  }
  if (after === before) {
    throw new Error(
      "a mutate function changed nothing — its search string is not in the document, " +
        "so this control would report a pass without testing anything. " +
        "Update the fixture rather than letting it pass silently.",
    );
  }
  return { before, after };
};

/**
 * Require the guard to NOTICE something, having been given `mutate`.
 *
 * `describe` is what this control is called; `expected` is a regex the guard's
 * OUTPUT must contain. They are separate on purpose. The first version used one
 * string for both, so three controls "failed" while the guard was correctly
 * exiting 1 — the helper was looking for its own description in the guard's
 * output. A control that cannot distinguish "failed for the right reason" from
 * "failed for an unrelated reason" is not a control.
 */
function mustFail(describe, expected, mutate) {
  const { before, after } = applyMutation(mutate);
  try {
    writeDoc(after);
    const r = run();
    const noticed = r.code !== 0 && new RegExp(expected, "i").test(r.out);
    results.push({
      name: noticed ? "notice: " + describe : "FAILED to notice: " + describe,
      ok: noticed,
      detail: noticed ? "" : "exit=" + r.code + " out=" + r.out.slice(0, 260),
    });
  } finally {
    writeDoc(before);
  }
}

/** Require the guard to stay quiet, because nothing is actually wrong. */
function mustPass(describe, mutate) {
  const { before, after } = applyMutation(mutate);
  try {
    writeDoc(after);
    const r = run();
    const quiet = r.code === 0;
    results.push({
      name: quiet ? "quiet: " + describe : "WRONGLY FAILED: " + describe,
      ok: quiet,
      detail: quiet ? "" : r.out.slice(0, 260),
    });
  } finally {
    writeDoc(before);
  }
}

// --- 1. the real thing passes -------------------------------------------------
{
  const r = run();
  results.push({
    name: "the real build and the real document agree",
    ok: r.code === 0,
    detail: r.code === 0 ? "" : r.out.slice(0, 300),
  });
}

// --- 2. the figure is wrong ---------------------------------------------------
// The drift that already happened once, reproduced deliberately: CHECKPOINT
// published 1,527,506 while the build emitted 1,527,558.
mustFail("the initial chunk size is wrong", "document says", (t) =>
  t.replace(/(Initial chunk \*\*)([\d,]+)( bytes raw\*\*)/, (m, a, n, c) => a + "1,527,506" + c),
);

// --- 3. the comma handling is load-bearing ------------------------------------
// `Number("1,527,558")` is NaN. If commas were not stripped the comparison
// would be NaN !== 1527558, which is TRUE, and the guard would fail on a
// CORRECT document — worse than not existing, because it trains people to
// distrust it.
//
// The first version of this pair was `mustPass(..., (t) => t)`, which is the
// identity function: it planted no condition and duplicated control 1. And its
// partner claimed to test "the same digits without a separator" while writing
// 1527506, a different and wrong number. So nothing tested the case that
// actually matters. These four are the real thing — the CORRECT digits, in both
// spellings, must pass, and the WRONG digits in both spellings must fail.
{
  const correct = (t) => /Initial chunk \*\*1,527,558 bytes raw\*\*/.test(t);
  if (!correct(original)) {
    console.error(
      "PRECONDITION FAILED — the document does not currently publish 1,527,558, so the\n" +
        "comma controls below cannot be written against it. Update them with the figure.",
    );
    process.exit(1);
  }
  // Correct digits, no separator -> must PASS. This is the case that was untested,
  // and the one that matters: it is the case where the guard must NOT fail a
  // document that is right.
  //
  // There is deliberately no "correct digits WITH a separator" control here. The
  // document already holds them, so any such mutation is a no-op — and the
  // first draft of this file included one anyway. `applyMutation` threw on it,
  // which is the guard working: the honest move was to delete the control, since
  // that case is already covered by control 1 running against the real file.
  mustPass("the CORRECT digits written without a separator", (t) =>
    t.replace("**1,527,558 bytes raw**", "**1527558 bytes raw**"),
  );
  // Wrong digits, separator -> must FAIL.
  mustFail("WRONG digits with a separator", "document says", (t) =>
    t.replace("**1,527,558 bytes raw**", "**1,527,506 bytes raw**"),
  );
  // Wrong digits, no separator -> must FAIL.
  mustFail("WRONG digits without a separator", "document says", (t) =>
    t.replace("**1,527,558 bytes raw**", "**1527506 bytes raw**"),
  );
}

// --- 4. the lesson-chunk count is independently checked -----------------------
// Two claims, so mutating one and leaving the other proves they are separate
// rather than one number printed twice.
mustFail("the lesson chunk count is wrong", "document says", (t) =>
  t.replace(/with \*\*(\d+)\*\* on-demand lesson chunks/, "with **29** on-demand lesson chunks"),
);

// --- 5. a REWORDED row retires the check loudly -------------------------------
// A pattern that matches nothing is an absent check, not a passing one. The
// guard must SAY SO -- and these two controls are why that distinction is
// asserted on the message rather than only on the exit code. A guard that exits
// 1 for a reworded row and a guard that exits 1 for a wrong number are
// indistinguishable to CI, and only the first is a thing to fix by editing the
// guard's own pattern.
mustFail(
  "a reworded claim reports an ABSENT check, naming the row",
  "matched no text in that row",
  (t) => t.replace("Initial chunk **", "Initial chunk (approx) **"),
);

mustFail(
  "a claim line rewritten out of existence is reported, not skipped",
  "matched no text in that row",
  (t) => t.replace(/with \*\*\d+\*\* on-demand lesson chunks/, "with the lessons listed below"),
);

mustFail(
  "a claim whose ROW is renamed reports that the row is gone",
  "is not in",
  (t) => t.replace("| Bundle & build output |", "| Bundle size |"),
);

// --- 6. quiet on correct-but-unrelated edits ---------------------------------
// A guard that fires on an unrelated edit gets switched off, which is why D-070
// records that outcome. Editing prose far from both claims must not trip it.
mustPass("an unrelated edit far from the row", (t) =>
  t.replace("## Health checks", "## Health checks\n\nA new sentence that mentions no figure at all."),
);

// --- 7. ROW ANCHORING, which is the defect that mattered most ----------------
// The guard used to scan every line of the document. The "Health checks"
// section is a DATED RECORD that is supposed to keep its old figures, and it
// carries "29 on-demand lesson chunks" — a number that must NOT be compared to
// today's build. It escaped only because the 29 was not bolded, so the pattern
// missed it. Bolding it, as a purely cosmetic edit, turned the guard red on a
// document that was entirely correct — and the failure message then instructed
// the reader to "correct the document", which for that line would mean falsifying
// a record this repository forbids falsifying.
//
// So: bold the historical 29, and the guard must STAY QUIET. This is the one
// control that would have caught the design flaw rather than a typo.
{
  const HISTORICAL = "with 29 on-demand lesson chunks";
  if (!original.includes(HISTORICAL)) {
    console.error(
      "PRECONDITION FAILED — the dated Health-checks row no longer reads\n" +
        '  "' + HISTORICAL + '".\n' +
        "  This control exists to prove a correctly-STALE historical figure is left alone,\n" +
        "  and it cannot be written against a string that is not there.",
    );
    process.exit(1);
  }
  mustPass("a BOLDED figure in a dated historical record is not this guard's business", (t) =>
    t.replace(HISTORICAL, "with **29** on-demand lesson chunks"),
  );
}

// --- report -------------------------------------------------------------------
console.log("\nCONTROLS\n");
for (const r of results) {
  console.log("  " + (r.ok ? "pass" : "FAIL") + "  " + r.name);
  if (r.detail) console.log("        " + String(r.detail).replace(/\s+/g, " ").slice(0, 220));
}
const failed = results.filter((r) => !r.ok);

// --- the tree must end exactly as it started ---------------------------------
const restored = fs.readFileSync(DOC_PATH, "utf8") === original;
console.log("");
console.log("  docs/CHECKPOINT.md restored byte-identical: " + restored);
if (!restored) {
  console.log("  THE FIXTURE LEAKED. The document is not what it was before this run.");
}

if (failed.length || !restored) {
  console.log("\n" + failed.length + " control(s) failed.");
  process.exit(1);
}
console.log("ALL CONTROLS PASS (" + results.length + " controls)");
