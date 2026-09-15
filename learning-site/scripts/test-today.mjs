// Correctness test for the time-aware picker.
//
// WHY THIS EXISTS
// lib/today.js decides what the site tells a reader to do today. Its failures
// are quiet and they all look like success:
//
//   * offering a 90-minute lab to someone who said they have thirty minutes —
//     the page renders fine, the reader just cannot start;
//   * re-offering a task the reader already answered, which teaches them the
//     suggestion is noise;
//   * offering an `ongoing` commitment ("apply to 5–10 roles a week") as if it
//     were a single sitting, which is nonsense on its face;
//   * treating an unjudged task as fitting, so a task nobody banded gets
//     offered as though someone had measured it.
//
// None of those throw. A picker that returns the wrong task returns a task, and
// a page showing a task looks exactly like a page showing the right task. So the
// behaviour is asserted here, under plain Node, with no React and no build step.
//
// Run: npm run test:today   (from learning-site/)

import {
  BANDS,
  bandInfo,
  fitsBand,
  addressedTaskIds,
  pickToday,
} from "../src/lib/today.js";

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

// A permissive energy filter, so band behaviour is tested in isolation.
const ANY = () => true;
// The real rule, in miniature: low mode accepts low; normal accepts low+normal;
// high accepts everything. Mirrors EnergyModeSelector.acceptsTask.
const acceptsEnergy = (mode, task) => {
  const e = task.energy || "normal";
  if (mode === "low") return e === "low";
  if (mode === "normal") return e === "low" || e === "normal";
  return true;
};

const task = (id, band, energy = "normal") => ({ id, band, energy, text: id });

// --- the band table is the contract ---------------------------------------

eq(BANDS.length, 4, "four bands");
eq(
  BANDS.map((b) => b.id),
  ["quick", "focused", "deep", "ongoing"],
  "band ids and their order"
);
eq(
  BANDS.filter((b) => b.rank === null).map((b) => b.id),
  ["ongoing"],
  "exactly one band has no rank — ongoing is not a duration"
);
ok(
  BANDS.every((b) => typeof b.label === "string" && b.label.length > 0),
  "every band has a reader-facing label"
);
ok(
  BANDS.every((b) => typeof b.note === "string" && b.note.length > 0),
  "every band has a note explaining itself"
);

eq(bandInfo("deep").label, "90 minutes or more", "bandInfo resolves a known band");
eq(bandInfo("nonsense"), null, "bandInfo returns null for an unknown band");
eq(bandInfo(undefined), null, "bandInfo tolerates undefined");

// --- fit is a rank comparison, and it is one-directional -------------------

ok(fitsBand("quick", "quick"), "quick fits quick");
ok(fitsBand("deep", "quick"), "a long budget accommodates a short task");
ok(fitsBand("deep", "focused"), "a long budget accommodates a medium task");
ok(fitsBand("focused", "quick"), "a medium budget accommodates a short task");
ok(!fitsBand("quick", "focused"), "a short budget does NOT fit a medium task");
ok(!fitsBand("quick", "deep"), "a short budget does NOT fit a long task");
ok(!fitsBand("focused", "deep"), "a medium budget does NOT fit a long task");
ok(fitsBand("deep", "deep"), "a long budget fits a long task");

// `ongoing` is excluded in both directions. It is not a duration, so it can
// never fit a duration budget — and a budget of `ongoing` is meaningless and
// must not silently accept everything.
ok(!fitsBand("quick", "ongoing"), "quick never fits an ongoing commitment");
ok(!fitsBand("deep", "ongoing"), "deep never fits an ongoing commitment");
ok(!fitsBand("ongoing", "quick"), "ongoing is not a usable budget");
ok(!fitsBand("ongoing", "ongoing"), "ongoing does not fit itself");

// Unknown values fail closed. A task nobody judged must not be offered as
// though someone had.
ok(!fitsBand("quick", null), "a null band does not fit");
ok(!fitsBand("quick", undefined), "an undefined band does not fit");
ok(!fitsBand("quick", "made-up"), "an unknown band does not fit");
ok(!fitsBand(null, "quick"), "a null budget fits nothing");
ok(!fitsBand("made-up", "quick"), "an unknown budget fits nothing");

// --- addressed: two facts, no new progress system -------------------------

{
  const phases = [
    {
      id: "p1",
      checklist: [{ id: "p1-c1" }, { id: "p1-c2" }],
      tasks: [{ id: "p1-t1" }, { id: "p1-t2" }],
    },
    {
      id: "p2",
      checklist: [{ id: "p2-c1" }],
      tasks: [{ id: "p2-t1" }],
    },
  ];

  // Nothing done, nothing written.
  eq(
    [...addressedTaskIds({}, {}, phases)].sort(),
    [],
    "an untouched track addresses nothing"
  );

  // An answered task counts as addressed.
  const withAnswer = { p1: { note: "", answers: { "p1-t2": "I did this" } } };
  const a1 = addressedTaskIds(withAnswer, {}, phases);
  ok(a1.has("p1-t2"), "an answered task is addressed");
  ok(!a1.has("p1-t1"), "an unanswered task is not");
  ok(!a1.has("p2-t1"), "an answer in one phase does not address another");

  // A blank answer is not an answer.
  const blank = { p1: { note: "", answers: { "p1-t1": "   \n " } } };
  ok(
    !addressedTaskIds(blank, {}, phases).has("p1-t1"),
    "a whitespace-only answer does not address a task"
  );

  // A fully ticked phase is behind the reader, so its tasks stop being offered.
  const done = { "p1-c1": true, "p1-c2": true };
  const a2 = addressedTaskIds({}, done, phases);
  ok(a2.has("p1-t1") && a2.has("p1-t2"), "a fully ticked phase addresses all its tasks");
  ok(!a2.has("p2-t1"), "a partly ticked phase addresses nothing");

  // Half-ticked is NOT behind the reader.
  const half = { "p1-c1": true };
  const a3 = addressedTaskIds({}, half, phases);
  ok(a3.size === 0, "a half-ticked phase addresses nothing");

  // A phase with an empty checklist must not be treated as complete, or every
  // task in it would vanish from the picker.
  const empty = [{ id: "p3", checklist: [], tasks: [{ id: "p3-t1" }] }];
  ok(
    !addressedTaskIds({}, {}, empty).has("p3-t1"),
    "a phase with no checklist items is not treated as complete"
  );

  // Malformed stores must not throw.
  eq([...addressedTaskIds(null, null, phases)], [], "a null store addresses nothing");
  eq([...addressedTaskIds({ p1: null }, {}, phases)], [], "a null phase entry is skipped");
  eq(
    [...addressedTaskIds({ p1: { answers: "nonsense" } }, {}, phases)],
    [],
    "a non-object answers field is skipped"
  );
}

// --- the picker returns the first task that fits --------------------------

const TASKS = [
  task("t1", "deep"),
  task("t2", "quick"),
  task("t3", "focused"),
];

{
  const r = pickToday({
    tasks: TASKS,
    budget: "quick",
    energy: "high",
    addressed: new Set(),
    accepts: ANY,
  });
  eq(r.task.id, "t2", "a quick budget skips the two larger tasks and takes the quick one");
  eq(r.reason, "ok", "reason is ok when a task is found");
}

{
  const r = pickToday({
    tasks: TASKS,
    budget: "focused",
    energy: "high",
    addressed: new Set(),
    accepts: ANY,
  });
  // t1 is deep and does not fit; t2 fits and comes first.
  eq(r.task.id, "t2", "the picker takes the first fitting task, not the largest");
}

{
  const r = pickToday({
    tasks: TASKS,
    budget: "deep",
    energy: "high",
    addressed: new Set(),
    accepts: ANY,
  });
  eq(r.task.id, "t1", "with a long budget the first task is taken in curriculum order");
}

// The order is the curriculum's, and the picker must not sort by size or
// difficulty. A picker that reshuffles the plan is a second curriculum.
{
  const shortFirst = [task("s", "quick"), task("l", "deep")];
  const r = pickToday({
    tasks: shortFirst,
    budget: "deep",
    energy: "high",
    addressed: new Set(),
    accepts: ANY,
  });
  eq(r.task.id, "s", "the picker does not reorder to prefer bigger tasks");
}

// --- addressed tasks are skipped, not returned -----------------------------

{
  const r = pickToday({
    tasks: TASKS,
    budget: "quick",
    energy: "high",
    addressed: new Set(["t2"]),
    accepts: ANY,
  });
  // Nothing else fits a quick budget.
  eq(r.task, null, "an addressed task is not offered again");
  eq(r.reason, "none-fit", "and the reason says nothing fitted the time");
  eq(r.smallestBlocking, "focused", "the cheapest blocking band is reported");
}

{
  const r = pickToday({
    tasks: [task("a", "quick"), task("b", "quick")],
    budget: "quick",
    energy: "high",
    addressed: new Set(["a"]),
    accepts: ANY,
  });
  eq(r.task.id, "b", "the next unaddressed fitting task is offered");
}

// --- the reasons are distinct and actionable -------------------------------

{
  const r = pickToday({
    tasks: [],
    budget: "quick",
    energy: "high",
    addressed: new Set(),
    accepts: ANY,
  });
  eq(r.reason, "empty", "no tasks at all is its own reason");
  eq(r.task, null, "and no task is returned");
  eq(r.smallestBlocking, null, "and no band is blamed");
}

eq(
  pickToday({
    tasks: [task("a", "quick")],
    budget: "quick",
    energy: "high",
    addressed: new Set(["a"]),
    accepts: ANY,
  }).reason,
  "all-addressed",
  "everything addressed is its own reason"
);

{
  // Nothing fits the time, and nothing was addressed either.
  const r = pickToday({
    tasks: [task("a", "deep")],
    budget: "quick",
    energy: "high",
    addressed: new Set(),
    accepts: ANY,
  });
  eq(r.reason, "none-fit", "a task that is too long yields none-fit");
  eq(r.smallestBlocking, "deep", "and names the band that would have fitted");
}

{
  // The cheapest blocking band is reported, not the first one encountered.
  const r = pickToday({
    tasks: [task("a", "deep"), task("b", "focused")],
    budget: "quick",
    energy: "high",
    addressed: new Set(),
    accepts: ANY,
  });
  eq(r.smallestBlocking, "focused", "the smallest blocking band is reported, not the first");
}

{
  // A task fits the time but not the energy.
  const r = pickToday({
    tasks: [task("a", "quick", "high")],
    budget: "quick",
    energy: "low",
    addressed: new Set(),
    accepts: acceptsEnergy,
  });
  eq(r.task, null, "a task that fails the energy filter is not offered");
  eq(r.reason, "none-fit-energy", "and the reason distinguishes energy from time");
  eq(r.smallestBlocking, null, "no time band is blamed when the problem was energy");
}

{
  // An ongoing commitment is never offered as a timed task, even with the
  // longest budget — the exact failure the band exists to prevent.
  const r = pickToday({
    tasks: [task("apply", "ongoing")],
    budget: "deep",
    energy: "high",
    addressed: new Set(),
    accepts: ANY,
  });
  eq(r.task, null, "an ongoing commitment is never offered as a sitting");
  eq(r.reason, "only-ongoing", "it gets its own reason, not a time-based one");
  eq(r.ongoingCount, 1, "and the ongoing count is reported");
  eq(r.smallestBlocking, null, "no duration is blamed, because none would help");
}

{
  // The distinction that matters: "nothing left" and "nothing that is a
  // sitting" are different facts. Collapsing them is the bug this guards.
  const r = pickToday({
    tasks: [task("apply", "ongoing"), task("connect", "ongoing")],
    budget: "quick",
    energy: "high",
    addressed: new Set(),
    accepts: ANY,
  });
  eq(r.reason, "only-ongoing", "two ongoing tasks still read as only-ongoing");
  eq(r.ongoingCount, 2, "both are counted");
  ok(
    r.reason !== "all-addressed",
    "leftover ongoing work is never reported as everything being done"
  );
}

{
  // A real duration that does not fit takes precedence over an ongoing task:
  // "make more time" is actionable, "this is a habit" is not.
  const r = pickToday({
    tasks: [task("apply", "ongoing"), task("lab", "deep")],
    budget: "quick",
    energy: "high",
    addressed: new Set(),
    accepts: ANY,
  });
  eq(r.reason, "none-fit", "the actionable blocker is reported first");
  eq(r.smallestBlocking, "deep", "and it names the band needed");
  eq(r.ongoingCount, 1, "the ongoing task is still counted alongside it");
}

{
  // An unbanded task is never presented as if it had been measured. It gets its
  // own reason rather than falling into a time bucket.
  const r = pickToday({
    tasks: [{ id: "x", text: "unbanded" }],
    budget: "deep",
    energy: "high",
    addressed: new Set(),
    accepts: ANY,
  });
  eq(r.task, null, "an unbanded task is not offered");
  eq(r.reason, "unjudged", "it is reported as unjudged, not as too long");
  eq(r.unjudgedCount, 1, "and counted");
}

{
  // A task with no band is not offered, and does not crash the walk.
  const r = pickToday({
    tasks: [{ id: "x", text: "unbanded" }, task("y", "quick")],
    budget: "quick",
    energy: "high",
    addressed: new Set(),
    accepts: ANY,
  });
  eq(r.task.id, "y", "an unbanded task is skipped and the next fitting one is taken");
}

{
  // A budget of `ongoing` is not a usable budget.
  const r = pickToday({
    tasks: TASKS,
    budget: "ongoing",
    energy: "high",
    addressed: new Set(),
    accepts: ANY,
  });
  eq(r.reason, "no-budget", "ongoing is rejected as a time budget");
}

// --- energy interacts with time, and neither overrides the other -----------

{
  const tasks = [task("a", "quick", "high"), task("b", "quick", "low")];
  const r = pickToday({
    tasks,
    budget: "quick",
    energy: "low",
    addressed: new Set(),
    accepts: acceptsEnergy,
  });
  eq(r.task.id, "b", "on a low-energy day the low-energy task is taken");
}

{
  const tasks = [task("a", "quick", "high")];
  const r = pickToday({
    tasks,
    budget: "quick",
    energy: "high",
    addressed: new Set(),
    accepts: acceptsEnergy,
  });
  eq(r.task.id, "a", "a high-energy task is offered on a high-energy day");
}

// Energy and band are independent axes. A quick task may be high energy; a deep
// task may be low energy. Nothing may conflate them.
{
  const r = pickToday({
    tasks: [task("quick-but-hard", "quick", "high")],
    budget: "quick",
    energy: "high",
    addressed: new Set(),
    accepts: acceptsEnergy,
  });
  eq(r.task.id, "quick-but-hard", "a quick task with high energy is offered normally");
}

// --- defensive input ------------------------------------------------------

eq(
  pickToday({ tasks: null, budget: "quick", energy: "high", addressed: new Set(), accepts: ANY })
    .reason,
  "empty",
  "a null task list is empty, not a crash"
);

{
  const r = pickToday({
    tasks: TASKS,
    budget: "quick",
    energy: "high",
    addressed: null,
    accepts: ANY,
  });
  eq(r.task.id, "t2", "a null addressed set is treated as nothing addressed");
}

{
  const r = pickToday({
    tasks: [task("a", "quick")],
    budget: "quick",
    energy: "high",
    addressed: new Set(),
    accepts: null,
  });
  eq(r.task.id, "a", "a null accepts function does not filter anything");
}

// --- report ---------------------------------------------------------------

if (failures.length) {
  console.error(
    "TODAY TEST FAILED — " + failures.length + " of " + checks + " checks failed:"
  );
  for (const f of failures) console.error("  ✗ " + f);
  process.exit(1);
}

console.log(
  "TODAY TEST PASSED — " +
    checks +
    " checks across band fitting, addressed tasks, ordering and the reasons."
);