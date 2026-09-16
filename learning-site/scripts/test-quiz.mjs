// Correctness test for the quiz's scoring logic.
//
// WHY THIS EXISTS
// The failure modes in lib/quiz.js are all quiet — none throw, and each one
// makes a broken quiz look exactly like a working one:
//
//   * a question marked correct against the wrong option, so a reader is told
//     their right answer is wrong;
//   * an unanswered question counted as wrong, so a reader is told they failed
//     something they never attempted;
//   * an answered-wrong question missing from the review list, so the summary
//     sends them back to the wrong part of the phase;
//   * the "which to reread" numbers off by one.
//
// So the behaviour is asserted here, under plain Node, with no React and no
// build step — the same discipline as test:work and test:data.
//
// Run: npm run test:quiz   (from learning-site/)

import {
  correctIndex,
  isCorrect,
  missedQuestions,
  answeredCount,
  summarise,
} from "../src/lib/quiz.js";

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

// --- fixtures ---------------------------------------------------------------
// Deliberately not all the same answer position: a fixture whose correct
// answers are all "A" cannot catch an off-by-one in the option scan.

const opt = (text, correct = false) => ({ text, correct });

const Q = [
  {
    id: "x-q01",
    question: "First",
    options: [opt("a"), opt("b", true), opt("c"), opt("d")],
  },
  {
    id: "x-q02",
    question: "Second",
    options: [opt("a", true), opt("b"), opt("c"), opt("d")],
  },
  {
    id: "x-q03",
    question: "Third",
    options: [opt("a"), opt("b"), opt("c"), opt("d", true)],
  },
];

// --- correctIndex -----------------------------------------------------------

eq(correctIndex(Q[0]), 1, "correct index found at position B");
eq(correctIndex(Q[1]), 0, "correct index found at position A");
eq(correctIndex(Q[2]), 3, "correct index found at position D");

// A malformed question must report -1 rather than silently claiming position 0,
// which would mark the first option correct on every broken question.
eq(correctIndex({ id: "bad", options: [] }), -1, "no correct option reports -1");
eq(correctIndex(null), -1, "null question reports -1");
eq(correctIndex({ id: "bad" }), -1, "question with no options array reports -1");
eq(
  correctIndex({ id: "bad", options: [opt("a"), opt("b")] }),
  -1,
  "question with no marked answer reports -1",
);

// A question with TWO marked answers resolves to the first, matching how the
// build's own validator counts them (it fails the build, so this is only about
// not crashing the page).
eq(
  correctIndex({ id: "two", options: [opt("a"), opt("b", true), opt("c", true)] }),
  1,
  "two marked answers resolve to the first",
);

// --- isCorrect --------------------------------------------------------------

ok(isCorrect(Q[0], 1), "the correct choice is correct");
ok(!isCorrect(Q[0], 0), "a wrong choice is not correct");
// The distinction that matters most: unanswered is NOT wrong.
ok(!isCorrect(Q[0], undefined), "an unanswered question is not correct");
ok(!isCorrect(Q[0], null), "a null choice is not correct");
// Position 0 must be distinguishable from "no answer". A falsy check would
// treat choosing A as unanswered.
ok(isCorrect(Q[1], 0), "choosing position A is recognised (0 is not falsy-missed)");

// --- answeredCount ----------------------------------------------------------

eq(answeredCount(Q, {}), 0, "nothing answered");
eq(answeredCount(Q, { "x-q01": 1 }), 1, "one answered");
eq(answeredCount(Q, { "x-q01": 1, "x-q02": 0, "x-q03": 3 }), 3, "all answered");
eq(answeredCount(Q, { "x-q02": 0 }), 1, "an answer of position 0 counts as answered");
eq(answeredCount(Q, { "x-q99": 1 }), 0, "an answer for an unknown id does not count");
eq(answeredCount(Q, null), 0, "null picks");

// --- missedQuestions --------------------------------------------------------

eq(missedQuestions(Q, {}), [], "nothing answered means nothing missed");
eq(
  missedQuestions(Q, { "x-q01": 1, "x-q02": 0, "x-q03": 3 }).length,
  0,
  "all correct means nothing missed",
);
eq(
  missedQuestions(Q, { "x-q01": 0 }).map((q) => q.id),
  ["x-q01"],
  "one wrong answer is reported",
);
eq(
  missedQuestions(Q, { "x-q01": 1, "x-q02": 3 }).map((q) => q.id),
  ["x-q02"],
  "an unanswered question is not reported as missed",
);
eq(
  missedQuestions(Q, { "x-q01": 0, "x-q02": 2, "x-q03": 3 }).map((q) => q.id),
  ["x-q01", "x-q02"],
  "missed questions come back in curriculum order",
);

// --- summarise --------------------------------------------------------------

eq(summarise(Q, {}).kind, "partial", "empty picks is partial, not perfect");
eq(summarise(Q, {}).text, "", "empty picks has no count sentence");
eq(summarise(Q, { "x-q01": 1 }).text, "1 of 3 answered.", "partial count reads correctly");

// The single most important assertion in this file: an incomplete quiz must
// never report as complete, whatever the reader got right so far.
ok(
  summarise(Q, { "x-q01": 1, "x-q02": 0 }).kind === "partial",
  "two of three correct is still partial",
);
ok(
  summarise(Q, { "x-q01": 1, "x-q02": 0 }).kind !== "perfect",
  "a perfect first two does not make an unfinished quiz perfect",
);

const perfect = summarise(Q, { "x-q01": 1, "x-q02": 0, "x-q03": 3 });
eq(perfect.kind, "perfect", "all correct is perfect");
ok(/Every answer correct/.test(perfect.text), "perfect summary says so");

const oneWrong = summarise(Q, { "x-q01": 1, "x-q02": 3, "x-q03": 3 });
eq(oneWrong.kind, "review", "one wrong needs review");
eq(oneWrong.numbers, [2], "the wrong question is named");
ok(/question 2\./.test(oneWrong.text), "single-question summary names question 2");

// Two wrong answers, chosen so that neither collides with a correct position.
// Q2's correct answer IS position 0, so picking 0 for Q2 is right, not wrong —
// the first draft of this fixture got that backwards and the test caught it.
const twoWrong = summarise(Q, { "x-q01": 0, "x-q02": 1, "x-q03": 3 });
eq(twoWrong.numbers, [1, 2], "both wrong questions are named");
ok(/questions 1, 2\./.test(twoWrong.text), "multi-question summary lists 1, 2");

// Numbers are 1-based and follow position in the list, so a reader counting
// down the page lands on the right question.
const secondOnly = summarise(Q, { "x-q01": 1, "x-q02": 2, "x-q03": 3 });
eq(secondOnly.numbers, [2], "the middle question is number 2, not 1 or 3");

// No score anywhere in any summary — the no-shame rule, asserted.
for (const [label, s] of [
  ["perfect", perfect],
  ["one wrong", oneWrong],
  ["two wrong", twoWrong],
  ["partial", summarise(Q, { "x-q01": 1 })],
]) {
  ok(!/%/.test(s.text), `${label} summary contains no percentage`);
  ok(!/\d+\s*\/\s*\d+/.test(s.text), `${label} summary contains no fraction`);
  ok(!/[Ss]core/.test(s.text), `${label} summary contains no score language`);
}

// --- robustness -------------------------------------------------------------

eq(summarise([], {}).kind, "empty", "an empty quiz reports empty");
eq(summarise(null, {}).kind, "empty", "a null quiz reports empty");
eq(missedQuestions(null, {}), [], "null questions are handled");
eq(missedQuestions(Q, undefined), [], "undefined picks are handled");

// --- report -----------------------------------------------------------------

console.log("");
if (failures.length) {
  for (const f of failures) console.log("  FAIL " + f);
  console.log("");
  console.log(`QUIZ TEST FAILED — ${failures.length} of ${checks} checks failed.`);
  process.exit(1);
}
console.log(`QUIZ TEST PASSED — ${checks} checks across scoring, ordering, the summary and robustness.`);
