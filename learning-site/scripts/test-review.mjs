// Controls for the review queue's data layer.
//
// WHY THIS FILE EXISTS
// The failure modes in lib/review.js are quiet, not loud. A wrong question
// collected means telling a reader to revisit something they already understand;
// a missed one means NOT telling them to revisit something they do not. Neither
// throws, neither shows up in a smoke render, and both make the page actively
// misleading. This project has been bitten repeatedly by guards that passed
// without being able to fail, so every assertion below is paired with the
// mutation that should break it.
//
// Run: node scripts/test-review.mjs

import { collectMissed, groupByPhase, summariseReview } from "../src/lib/review.js";

let checks = 0;
const failures = [];

function eq(actual, expected, label) {
  checks++;
  const a = JSON.stringify(actual);
  const b = JSON.stringify(expected);
  if (a !== b) failures.push(label + "\n      expected " + b + "\n      got      " + a);
}

// --- fixtures --------------------------------------------------------------
// Deliberately hand-built rather than read from the real curriculum: a fixture
// that changes when content changes turns a logic test into a content test.

function q(id, correctIdx = 0, n = 4) {
  return {
    id,
    question: "Question " + id + "?",
    options: Array.from({ length: n }, (_, i) => ({
      text: "Option " + i,
      correct: i === correctIdx,
    })),
    explanation: "Because of " + id + ".",
  };
}

const TRACKS = [
  {
    id: "it-roadmap",
    label: "IT",
    phases: [
      { id: "it-01", title: "Phase 1 — Fundamentals", quiz: [q("it-01-q01", 0), q("it-01-q02", 2)] },
      { id: "it-02", title: "Phase 2 — Networking", quiz: [q("it-02-q01", 1)] },
    ],
  },
  {
    id: "cyber-roadmap",
    label: "Cyber",
    phases: [{ id: "cyber-01", title: "Phase 1 — Foundations", quiz: [q("cyber-01-q01", 3)] }],
  },
];

// --- collectMissed ---------------------------------------------------------

// A correct answer is NOT collected. This is the assertion that keeps the page
// from telling a reader to revisit what they already know.
eq(
  collectMissed({ "it-01-q01": 0 }, TRACKS).length,
  0,
  "a correct answer is not collected",
);

// A wrong answer IS collected, and carries its phase and chosen index.
{
  const got = collectMissed({ "it-01-q01": 1 }, TRACKS);
  eq(got.length, 1, "a wrong answer is collected");
  eq(got[0].phaseId, "it-01", "the collected item names its phase");
  eq(got[0].chosen, 1, "the collected item carries the chosen index");
  eq(got[0].trackLabel, "IT", "the collected item carries its track label");
  eq(got[0].question.id, "it-01-q01", "the collected item carries the question");
}

// NEVER ANSWERED is not a gap. This is the most important rule in the module:
// a reader has not met an unanswered question yet, so listing it as something to
// revisit would tell a beginner they are behind on material they have not
// studied.
//
// THE FIRST VERSION OF THIS ASSERTION WAS VACUOUS, and mutation testing caught
// it. It passed `{}` and expected zero -- but with no answers at all, the
// `isCorrect` check ALSO drops every question, so the test passed whether or not
// the `chosen === undefined` guard existed. Deleting that guard left the suite
// green.
//
// A test for "unanswered is not collected" needs a fixture where SOME questions
// are answered and some are not, so the two rules can disagree. IT 01 has two
// questions; answer the first wrong and leave the second alone. Now the
// `isCorrect` rule alone would collect NEITHER (one is right, one is unanswered)
// whereas treating unanswered as a gap would collect BOTH. The counts differ, so
// the assertion can fail.
{
  const withOneAnswered = collectMissed({ "it-01-q01": 1 }, TRACKS);
  eq(withOneAnswered.length, 1, "the answered-and-wrong question is collected");
  eq(withOneAnswered[0].question.id, "it-01-q01", "and it is the one that was answered");
  // The unanswered sibling must be absent. If unanswered questions were treated
  // as gaps this would be 2, and the id would be it-01-q02.
  eq(
    withOneAnswered.some((m) => m.question.id === "it-01-q02"),
    false,
    "the UNANSWERED sibling is not collected (answering one question must not surface the other)",
  );
  eq(
    withOneAnswered.filter((m) => m.chosen === undefined).length,
    0,
    "no collected item has an undefined choice",
  );
}

eq(
  collectMissed({}, TRACKS).length,
  0,
  "no answers at all yields nothing",
);
eq(
  collectMissed({ "it-01-q01": 0, "cyber-01-q01": 3 }, TRACKS).length,
  0,
  "two answers, both correct, yields nothing",
);

// A mixed set: one right, one wrong. Exactly the wrong one comes back — this is
// the case where "collects correct answers" and "collects unanswered" would both
// show up as a wrong count.
{
  const mixed = collectMissed({ "it-01-q01": 0, "it-01-q02": 1 }, TRACKS);
  eq(mixed.length, 1, "a mixed set returns only the wrong answer");
  eq(mixed[0].question.id, "it-01-q02", "and it is the wrong one, not the right one");
  eq(mixed[0].chosen, 1, "with the choice the reader actually made");
}

// Order follows the curriculum, not the object's key order. Reversing the input
// keys must not reverse the output — otherwise the page's order depends on
// insertion order, which is invisible and untestable by a reader.
{
  // Index 1 is wrong for it-01-q01 (correct 0) and wrong for cyber-01-q01
  // (correct 3), and in range for both -- so the ordering assertion is about
  // order and nothing else.
  const forward = collectMissed({ "it-01-q01": 1, "cyber-01-q01": 1 }, TRACKS).map((m) => m.phaseId);
  const reversed = collectMissed({ "cyber-01-q01": 1, "it-01-q01": 1 }, TRACKS).map((m) => m.phaseId);
  eq(forward, ["it-01", "cyber-01"], "curriculum order, IT before cyber");
  eq(reversed, forward, "input key order does not change the output order");
}

// A malformed answer is ignored rather than compared. readQuizAnswers() already
// drops these, but collectMissed must not trust its caller: a string index would
// compare against an integer and mark a right answer wrong.
eq(collectMissed({ "it-01-q01": "0" }, TRACKS).length, 0, "a string index is ignored");
eq(collectMissed({ "it-01-q01": null }, TRACKS).length, 0, "a null index is ignored");
eq(collectMissed({ "it-01-q01": 1.5 }, TRACKS).length, 0, "a fractional index is ignored");
// A NEGATIVE index is not a choice. Without this assertion, dropping the `|| chosen < 0`
// clause went unnoticed by the whole suite -- and the consequence is real: a negative
// index matches no option, so `isCorrect` reports false and a corrupt stored value
// surfaces as a phantom "you got this wrong" for a question the reader never answered.
eq(collectMissed({ "it-01-q01": -1 }, TRACKS).length, 0, "a negative index is ignored");
eq(collectMissed({ "it-01-q01": -99 }, TRACKS).length, 0, "a large negative index is ignored");
// An index past the end of the option list is equally not a choice.
eq(collectMissed({ "it-01-q01": 99 }, TRACKS).length, 0, "an out-of-range index is ignored");

// An answer for a question that no longer exists is dropped, not crashed on.
eq(
  collectMissed({ "it-99-q01": 1 }, TRACKS).length,
  0,
  "an answer for a removed question is dropped",
);

// Junk input does not throw — this runs on page mount.
eq(collectMissed(null, TRACKS).length, 0, "null answers yields nothing");
eq(collectMissed({}, null).length, 0, "null tracks yields nothing");
eq(collectMissed({ "it-01-q01": 1 }, [{ id: "x", label: "X" }]).length, 0, "a track with no phases yields nothing");

// A phase with no quiz array at all must not throw.
eq(
  collectMissed({ "it-01-q01": 1 }, [{ id: "t", label: "T", phases: [{ id: "p", title: "P" }] }]).length,
  0,
  "a phase with no quiz array is skipped",
);

// --- summariseReview -------------------------------------------------------
// Counts what EXISTS, with no denominator. If a ratio ever appears here, the
// no-shame rule has been broken and this assertion is where it should fail.

eq(summariseReview([]), { questions: 0, phases: 0 }, "empty summary is zero, not a ratio");
eq(summariseReview(null), { questions: 0, phases: 0 }, "null summary is zero");

{
  const missed = collectMissed({ "it-01-q01": 1, "it-01-q02": 1, "cyber-01-q01": 1 }, TRACKS);
  const s = summariseReview(missed);
  eq(s.questions, 3, "summary counts questions");
  eq(s.phases, 2, "summary counts DISTINCT phases, not items");
  eq(Object.keys(s).sort(), ["phases", "questions"], "summary exposes no ratio or percentage");
}

// Two wrong answers in ONE phase must count as one phase.
{
  const s = summariseReview(collectMissed({ "it-01-q01": 1, "it-01-q02": 1 }, TRACKS));
  eq(s.phases, 1, "two misses in one phase count as one phase");
  eq(s.questions, 2, "two misses in one phase count as two questions");
}

// --- groupByPhase ----------------------------------------------------------

{
  const groups = groupByPhase(collectMissed({ "it-01-q01": 1, "it-01-q02": 1, "cyber-01-q01": 1 }, TRACKS));
  eq(groups.length, 2, "two phases produce two groups");
  eq(groups[0].phaseId, "it-01", "groups keep curriculum order");
  eq(groups[1].phaseId, "cyber-01", "groups keep curriculum order for the second");
  eq(groups[0].items.length, 2, "a group collects all of its phase's misses");
  eq(groups[0].phaseTitle, "Phase 1 — Fundamentals", "a group carries its phase title");
  eq(groups[0].trackLabel, "IT", "a group carries its track label");
}

eq(groupByPhase([]).length, 0, "no misses produces no groups");
eq(groupByPhase(null).length, 0, "null produces no groups");

// Every collected item must appear in exactly one group — a dropped item is the
// silent failure this module exists to prevent.
{
  const missed = collectMissed({ "it-01-q01": 1, "it-01-q02": 1, "cyber-01-q01": 1 }, TRACKS);
  const total = groupByPhase(missed).reduce((n, g) => n + g.items.length, 0);
  eq(total, missed.length, "every collected item lands in exactly one group");
}

// --- report ----------------------------------------------------------------

if (failures.length) {
  console.log("");
  for (const f of failures) console.log("  FAIL  " + f);
  console.log("");
  console.log(failures.length + " of " + checks + " checks failed.");
  process.exit(1);
}

console.log(
  "REVIEW TEST PASSED — " +
    checks +
    " checks across collection, the unanswered rule, ordering, summaries and grouping.",
);
