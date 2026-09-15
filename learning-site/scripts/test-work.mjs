// Correctness test for the read-back of the reader's own writing.
//
// WHY THIS EXISTS
// lib/yourWork.js turns the notes store into an ordered page. Its failure modes
// are all quiet:
//
//   * an answer attached to the wrong task, because it was matched by position
//     instead of by id;
//   * an orphaned answer — one whose task no longer exists — silently dropped,
//     which deletes writing the reader did;
//   * a phase with a note but no answers omitted, or vice versa;
//   * the page reshuffling because it followed object key order rather than the
//     curriculum's order.
//
// None of those throw. A page that renders four of your five answers looks
// exactly like a page where you wrote four. So the behaviour is asserted here,
// under plain Node, with no React and no build step — the same discipline
// lib/transfer.js follows.
//
// Run: npm run test:work   (from learning-site/)

import { collectWork, summariseWork } from "../src/lib/yourWork.js";

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

// --- a miniature curriculum -------------------------------------------------
// Two tracks, two phases each, so cross-track ordering is exercised rather than
// assumed. Task ids follow the real `<phase-id>-tNN` minting scheme.

const TRACKS = [
  {
    id: "it",
    label: "IT Roadmap",
    phases: [
      {
        id: "it-01-x",
        title: "Phase 1 — First",
        tasks: [
          { id: "it-01-x-t01", text: "Task one" },
          { id: "it-01-x-t02", text: "Task two" },
        ],
      },
      {
        id: "it-02-x",
        title: "Phase 2 — Second",
        tasks: [{ id: "it-02-x-t01", text: "Another task" }],
      },
    ],
  },
  {
    id: "cyber",
    label: "Cybersecurity",
    phases: [
      {
        id: "cyber-01-x",
        title: "Phase 1 — Cyber first",
        tasks: [{ id: "cyber-01-x-t01", text: "Cyber task" }],
      },
    ],
  },
];

// --- empty and malformed input ---------------------------------------------

eq(collectWork({}, TRACKS), [], "no notes yields no groups");
eq(collectWork(null, TRACKS), [], "a null store yields no groups");
eq(collectWork(undefined, TRACKS), [], "an undefined store yields no groups");
eq(collectWork({}, null), [], "no tracks yields no groups");
eq(collectWork("nonsense", TRACKS), [], "a non-object store yields no groups");
eq(
  collectWork({ "it-01-x": null }, TRACKS),
  [],
  "a null phase entry is skipped rather than thrown on"
);

// --- ordering follows the curriculum, not the store ------------------------
//
// The stored object's key order is whatever order the reader happened to type
// in. If the page followed it, the same writing would appear in a different
// order between sessions for no reason the reader can see.

{
  const notes = {
    "cyber-01-x": { note: "cyber note", answers: {} },
    "it-02-x": { note: "second note", answers: {} },
    "it-01-x": { note: "first note", answers: {} },
  };
  const groups = collectWork(notes, TRACKS);
  eq(
    groups.map((g) => g.phaseId),
    ["it-01-x", "it-02-x", "cyber-01-x"],
    "groups follow track then phase order, not store key order"
  );
  eq(
    groups.map((g) => g.trackLabel),
    ["IT Roadmap", "IT Roadmap", "Cybersecurity"],
    "each group carries its track label"
  );
}

// --- answers are matched by id, never by position --------------------------
//
// The load-bearing one. `build-content.mjs` mints task ids from position, so a
// renumbering is possible; the answer must survive it and must be recognised as
// orphaned rather than reassigned to whatever now sits at that index.

{
  const notes = {
    "it-01-x": {
      note: "",
      answers: { "it-01-x-t02": "the answer to task two" },
    },
  };
  const groups = collectWork(notes, TRACKS);
  eq(groups.length, 1, "a phase with only an answer is included");
  eq(groups[0].answers.length, 1, "one answer");
  eq(groups[0].answers[0].taskId, "it-01-x-t02", "the answer keeps its own id");
  eq(
    groups[0].answers[0].taskText,
    "Task two",
    "the answer is paired with the task it actually belongs to"
  );
  eq(groups[0].answers[0].orphaned, false, "a live answer is not orphaned");
}

{
  // An answer whose task is gone. It must be KEPT and flagged — dropping it
  // would delete writing the reader did, which no read-back view has any right
  // to do.
  const notes = {
    "it-01-x": { note: "", answers: { "it-01-x-t99": "writing that must survive" } },
  };
  const groups = collectWork(notes, TRACKS);
  eq(groups.length, 1, "a phase with only an orphaned answer is included");
  eq(groups[0].answers.length, 1, "the orphaned answer is kept");
  eq(groups[0].answers[0].orphaned, true, "it is flagged as orphaned");
  eq(groups[0].answers[0].taskText, "", "an orphan has no task text to show");
  eq(
    groups[0].answers[0].answer,
    "writing that must survive",
    "the reader's words are preserved verbatim"
  );
}

// --- answers are ordered by the phase's task order -------------------------

{
  const notes = {
    "it-01-x": {
      note: "",
      // Deliberately stored in reverse order.
      answers: { "it-01-x-t02": "second", "it-01-x-t01": "first" },
    },
  };
  const groups = collectWork(notes, TRACKS);
  eq(
    groups[0].answers.map((a) => a.answer),
    ["first", "second"],
    "answers follow the curriculum's task order, not insertion order"
  );
}

// --- blank writing is not writing ------------------------------------------

{
  const notes = {
    "it-01-x": { note: "   ", answers: { "it-01-x-t01": "  \n " } },
  };
  eq(
    collectWork(notes, TRACKS),
    [],
    "whitespace-only note and answer produce no group"
  );
}

{
  const notes = {
    "it-01-x": { note: "a note", answers: { "it-01-x-t01": "" } },
  };
  const groups = collectWork(notes, TRACKS);
  eq(groups.length, 1, "a note alone is enough for a group");
  eq(groups[0].answers.length, 0, "an empty answer is not rendered");
  eq(groups[0].note, "a note", "the note survives");
}

{
  // A non-string answer must not reach the page as an object.
  const notes = { "it-01-x": { note: "", answers: { "it-01-x-t01": 42 } } };
  eq(collectWork(notes, TRACKS), [], "a non-string answer is ignored");
}

// --- a phase absent from the curriculum is dropped, not crashed on ---------

{
  const notes = { "no-such-phase": { note: "orphan phase", answers: {} } };
  eq(
    collectWork(notes, TRACKS),
    [],
    "a phase that no longer exists is skipped"
  );
}

// --- the summary counts what exists, with no denominator -------------------

{
  const notes = {
    "it-01-x": { note: "n", answers: { "it-01-x-t01": "a", "it-01-x-t02": "b" } },
    "it-02-x": { note: "", answers: { "it-02-x-t01": "c" } },
    "cyber-01-x": { note: "m", answers: { "cyber-01-x-t99": "orphan" } },
  };
  const summary = summariseWork(collectWork(notes, TRACKS));
  eq(summary.phases, 3, "summary: three phases hold writing");
  eq(summary.notes, 2, "summary: two notes");
  eq(summary.answers, 4, "summary: four answers");
  eq(summary.orphaned, 1, "summary: one orphaned answer");

  // The shape itself is the guarantee. A `total` or a `percent` here would be
  // the first step toward the page keeping score, which D-019 forbids.
  ok(
    !("total" in summary) && !("percent" in summary) && !("remaining" in summary),
    "summary exposes no denominator or completion figure"
  );
}

eq(
  summariseWork([]),
  { phases: 0, notes: 0, answers: 0, orphaned: 0 },
  "summary of nothing is all zeroes"
);

// --- report ---------------------------------------------------------------

if (failures.length) {
  console.error(
    "WORK TEST FAILED — " + failures.length + " of " + checks + " checks failed:"
  );
  for (const f of failures) console.error("  ✗ " + f);
  process.exit(1);
}

console.log(
  "WORK TEST PASSED — " +
    checks +
    " checks across ordering, id matching, orphans and the summary."
);