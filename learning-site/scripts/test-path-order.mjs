// Correctness test for the path-order view's classification.
//
// WHY THIS EXISTS
// The feature it guards is one adjective away from a completion-scold, on a
// curriculum written for someone at risk of burning out. The rule that keeps it
// honest is structural, so it is asserted structurally: `classifyPhases` returns
// no `remaining`, no `missing`, no percentage and no total-of-what-is-left, and
// `untouchedPhases` returns rows rather than a count. A future edit that adds
// "6 phases left" to this module fails here rather than shipping.
//
// The other half is the classification itself, where the interesting case is a
// phase with NOTHING ticked and a note written. A reader who opened a phase,
// wrote a line and ticked nothing has been there; calling that "not started"
// would be wrong about their own file.
//
// Run: npm run test:path-order   (from learning-site/)

import {
  classifyPhases,
  untouchedPhases,
  openPhases,
} from "../src/lib/pathOrder.js";

const failures = [];
let checks = 0;

function ok(cond, label, detail) {
  checks++;
  if (!cond) failures.push(label + (detail ? " — " + detail : ""));
}

function eq(actual, expected, label) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  checks++;
  if (a !== e) failures.push(label + " — expected " + e + ", got " + a);
}

const track = {
  id: "it",
  phases: [
    {
      id: "p1",
      title: "Phase 1",
      checklist: [{ id: "p1-a" }, { id: "p1-b" }],
    },
    {
      id: "p2",
      title: "Phase 2",
      checklist: [{ id: "p2-a" }],
    },
    {
      // A phase with an EMPTY checklist. It must never read as complete, or a
      // malformed phase would silently swallow its whole row — the same guard
      // D-021 established for the addressed rules.
      id: "p3",
      title: "Phase 3",
      checklist: [],
    },
    {
      id: "p4",
      title: "Phase 4",
      checklist: [{ id: "p4-a" }, { id: "p4-b" }],
    },
  ],
};

// --- 1. the three states ----------------------------------------------------
{
  const done = { "p1-a": true, "p1-b": true, "p2-a": true };
  const rows = classifyPhases(track, done, {});

  eq(rows.length, 4, "one row per phase");
  eq(rows[0].state, "complete", "all checklist ticked is complete");
  eq(rows[1].state, "complete", "a single-item checklist can be complete");
  eq(rows[2].state, "untouched", "an EMPTY checklist is not complete");
  eq(rows[3].state, "untouched", "nothing recorded is untouched");

  eq(rows[0].done, 2, "done count is right");
  eq(rows[0].total, 2, "total comes from the phase");
  eq(rows[3].done, 0, "an untouched phase has zero done");
}

// --- 2. writing counts as work, even with nothing ticked --------------------
{
  const notes = { p2: { note: "I read this one", answers: {} } };
  const rows = classifyPhases(track, {}, notes);
  eq(
    rows[1].state,
    "in-progress",
    "a note with nothing ticked is in-progress, not untouched"
  );
  ok(rows[1].hasNote, "hasNote is reported");

  // And an answer alone counts too, for the same reason.
  const answersOnly = { p2: { note: "", answers: { "p2-a": "my answer" } } };
  const rows2 = classifyPhases(track, {}, answersOnly);
  eq(rows2[1].state, "in-progress", "an answer with nothing ticked is in-progress");
  eq(rows2[1].answers, 1, "answer count is reported");

  // A whitespace-only note is not writing.
  const blank = { p2: { note: "   \n  ", answers: {} } };
  const rows3 = classifyPhases(track, {}, blank);
  eq(rows3[1].state, "untouched", "a whitespace-only note does not count as writing");

  const blankAnswer = { p2: { note: "", answers: { "p2-a": "  " } } };
  const rows4 = classifyPhases(track, {}, blankAnswer);
  eq(rows4[1].state, "untouched", "a whitespace-only answer does not count");
}

// --- 3. partial work is in-progress -----------------------------------------
{
  const rows = classifyPhases(track, { "p1-a": true }, {});
  eq(rows[0].state, "in-progress", "half a checklist is in-progress");
  eq(rows[0].done, 1, "the partial count is right");
}

// --- 4. the lists, in curriculum order --------------------------------------
{
  const done = { "p2-a": true };
  const notes = { p1: { note: "started", answers: {} } };
  const untouched = untouchedPhases(track, done, notes);
  const open = openPhases(track, done, notes);

  eq(
    untouched.map((r) => r.phase.id),
    ["p3", "p4"],
    "untouched lists only untouched phases, in order"
  );
  eq(
    open.map((r) => r.phase.id),
    ["p1"],
    "open lists only in-progress phases, in order"
  );

  // p1 has a note, p2 is complete, p3 and p4 are untouched: every phase appears
  // in exactly one of the three states.
  const all = classifyPhases(track, done, notes);
  eq(
    all.map((r) => r.state),
    ["in-progress", "complete", "untouched", "untouched"],
    "every phase lands in exactly one state"
  );
}

// --- 5. THE STRUCTURAL RULE: no denominator, no scold ----------------------
{
  const rows = classifyPhases(track, { "p1-a": true }, {});
  const row = rows[0];

  // A row may say how much of THIS phase is done. It must not carry a figure for
  // what the reader has not done, and it must not carry a cross-phase total.
  for (const forbidden of [
    "remaining",
    "missing",
    "left",
    "percent",
    "percentage",
    "pct",
    "skipped",
    "overdue",
    "behind",
  ]) {
    ok(
      !(forbidden in row),
      "a row carries no “" + forbidden + "” field"
    );
  }

  // No value anywhere in the row is a percentage-shaped number.
  const flat = JSON.stringify(row);
  ok(!/%/.test(flat), "no percent sign appears in a row");
  ok(!/\bof \d+/i.test(flat), "no “N of M” phrasing appears in a row");
}

// --- 6. the list functions return rows, never a count -----------------------
{
  const untouched = untouchedPhases(track, {}, {});
  ok(Array.isArray(untouched), "untouchedPhases returns an array");
  ok(
    untouched.every((r) => typeof r === "object" && r.phase),
    "each entry is a row, not a number"
  );

  const open = openPhases(track, {}, {});
  ok(Array.isArray(open), "openPhases returns an array");
  eq(open.length, 0, "nothing started means nothing open");
}

// --- 7. missing or malformed input does not throw ---------------------------
{
  // The page reads `done` from a plain read and `notes` from storage, either of
  // which can be absent on a fresh profile.
  let threw = null;
  try {
    classifyPhases(track, null, null);
    classifyPhases(track, undefined, undefined);
    classifyPhases({ phases: null }, {}, {});
  } catch (e) {
    threw = e.message;
  }
  ok(!threw, "absent inputs are tolerated rather than throwing", threw);

  eq(classifyPhases(track, null, null).length, 4, "a null store still classifies every phase");
  eq(classifyPhases({}, {}, {}).length, 0, "a track with no phases yields no rows");
}

// --- report -----------------------------------------------------------------
console.log("");
if (failures.length) {
  console.log("PATH ORDER TEST FAILED — " + failures.length + " of " + checks + " checks failed:");
  for (const f of failures) console.log("  ✗ " + f);
  process.exit(1);
}
console.log(
  "PATH ORDER TEST PASSED — " +
    checks +
    " checks across the three states, writing-as-work, and the no-denominator rule."
);
