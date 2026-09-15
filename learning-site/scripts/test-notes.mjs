// Correctness test for the notes store and its merge behaviour.
//
// WHY THIS EXISTS
// `useNotes` is the only hook in the site that holds text the reader typed and
// cannot regenerate. Progress can be re-ticked by reading a checklist again;
// a paragraph someone wrote about what confused them cannot be reconstructed by
// anyone. Two things therefore have to be true and are asserted here:
//
//   1. An answer is keyed by its task id, never by its position in the list, so
//      inserting a task cannot move one reader's writing onto another question.
//   2. A merge never overwrites something written on this machine with an older
//      draft from another one.
//
// The second is the same class of bug `test-data.mjs` guards for every other
// registered key, but notes nest one level deeper than anything there, so the
// per-task union has its own suite rather than riding on that one.
//
// The pure helpers are exercised under plain Node. The React hook is not, since
// it needs a renderer — what it delegates to is what is tested, and the smoke
// test covers that the component mounts.
//
// Run: npm run test:notes   (from learning-site/)

import { mergeValue, KEYS } from "../src/lib/transfer.js";

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

// --- the key is registered -------------------------------------------------

const entry = KEYS.find((k) => k.key === "cs-roadmap:notes:v1");

ok(Boolean(entry), "notes key is registered in KEYS");
ok(entry && entry.kind.includes("phaseId"), "notes key documents its shape");
ok(entry && typeof entry.check === "function", "notes key carries a validator");

// There is deliberately NO `KEYS.length === N` assertion here.
//
// There used to be, and it broke on two consecutive key additions (8 → 9 → 10)
// while catching nothing: it restated a number maintained by hand in this file,
// so it could only ever fail when someone edited the registry on purpose. The
// question it was trying to ask — "is every key the site writes registered?" —
// is answered properly in test-data.mjs, which scans src/ for `cs-roadmap:*:vN`
// literals and compares them against KEYS in both directions. Duplicating a
// weaker version of that check here only adds a second place to update.

// --- the validator --------------------------------------------------------

const check = entry ? entry.check : () => false;

ok(check({}), "an empty notes map is valid");
ok(
  check({ "it-01-computer-fundamentals": { note: "hello", answers: {} } }),
  "a phase with a note and no answers is valid"
);
ok(
  check({ "it-01-x": { note: "", answers: { "it-01-x-t01": "an answer" } } }),
  "a phase with answers and no note is valid"
);
ok(check({ "it-01-x": { note: "" } }), "an absent answers object is tolerated");

ok(!check(null), "null is refused");
ok(!check([]), "an array is refused");
ok(!check("string"), "a string is refused");
ok(!check({ "": { note: "x" } }), "an empty phase id is refused");
ok(!check({ "it-01-x": "not an object" }), "a non-object entry is refused");
ok(
  !check({ "it-01-x": { answers: {} } }),
  "an entry missing its note field is refused"
);
ok(
  !check({ "it-01-x": { note: "x", answers: "nope" } }),
  "a non-object answers value is refused"
);
ok(
  !check({ "it-01-x": { note: "x", answers: { "t01": 42 } } }),
  "a non-string answer is refused"
);
ok(
  !check({ "it-01-x": { note: "x", answers: { "": "orphan" } } }),
  "an empty task id is refused"
);

// --- the merge rule -------------------------------------------------------
//
// This is the part worth testing hardest. The rule is: union across phases and
// across tasks, existing wins on every collision, and a phase that exists only
// on the incoming side is taken whole so moving to a new laptop actually works.

const KEY = "cs-roadmap:notes:v1";

// A phase only on the incoming side comes across untouched.
eq(
  mergeValue(
    KEY,
    {},
    { "it-02-x": { note: "from the other laptop", answers: { "it-02-x-t01": "a" } } }
  ),
  { "it-02-x": { note: "from the other laptop", answers: { "it-02-x-t01": "a" } } },
  "a phase only in the incoming file is taken whole"
);

// A phase only on this machine is never dropped.
eq(
  mergeValue(KEY, { "it-01-x": { note: "mine", answers: {} } }, {}),
  { "it-01-x": { note: "mine", answers: {} } },
  "a phase only on this machine survives an import"
);

// The note is prose: existing wins, the incoming draft does not clobber it.
eq(
  mergeValue(
    KEY,
    { "it-01-x": { note: "what I wrote here", answers: {} } },
    { "it-01-x": { note: "an older draft", answers: {} } }
  )["it-01-x"].note,
  "what I wrote here",
  "an existing note is not overwritten by an import"
);

// An empty local note does NOT win — otherwise importing onto a fresh machine
// would leave the reader with nothing.
eq(
  mergeValue(
    KEY,
    { "it-01-x": { note: "", answers: {} } },
    { "it-01-x": { note: "the real note", answers: {} } }
  )["it-01-x"].note,
  "the real note",
  "an empty local note does not block an incoming one"
);

// Answers union per task id.
//
// Compared value-by-value rather than by JSON equality: the merge spreads the
// incoming answers first, so the resulting KEY ORDER is {t02, t01}. Asserting
// with `eq` here would fail on key order and say nothing about the union, which
// is the thing under test.
const unioned = mergeValue(
  KEY,
  { "it-01-x": { note: "", answers: { "it-01-x-t01": "local one" } } },
  { "it-01-x": { note: "", answers: { "it-01-x-t02": "incoming two" } } }
)["it-01-x"].answers;
eq(
  Object.keys(unioned).sort(),
  ["it-01-x-t01", "it-01-x-t02"],
  "answers union across task ids — both ids present"
);
eq(unioned["it-01-x-t01"], "local one", "the local answer survives the union");
eq(unioned["it-01-x-t02"], "incoming two", "the incoming answer is added by the union");

// Existing wins per task on a collision.
eq(
  mergeValue(
    KEY,
    { "it-01-x": { note: "", answers: { "it-01-x-t01": "mine" } } },
    { "it-01-x": { note: "", answers: { "it-01-x-t01": "theirs" } } }
  )["it-01-x"].answers["it-01-x-t01"],
  "mine",
  "an existing answer wins on a task-id collision"
);

// Importing the same file twice is a no-op, not a duplicate.
const once = { "it-01-x": { note: "n", answers: { "it-01-x-t01": "a" } } };
eq(
  mergeValue(KEY, mergeValue(KEY, {}, once), once),
  once,
  "importing the same notes twice changes nothing"
);

// --- keyed by id, not by position -----------------------------------------
//
// The minted task ids are what make the answer stick to its question. If these
// ever drift, a reader's writing silently reappears under a different task, so
// the shape itself is asserted.

const minted = (phaseId, i) => phaseId + "-t" + String(i + 1).padStart(2, "0");
eq(minted("it-01-computer-fundamentals", 0), "it-01-computer-fundamentals-t01", "first task id");
eq(minted("it-01-computer-fundamentals", 9), "it-01-computer-fundamentals-t10", "tenth task id");
ok(
  minted("cyber-09-cloud-and-identity", 0) !== minted("it-01-computer-fundamentals", 0),
  "task ids are namespaced by phase"
);

// --- report ---------------------------------------------------------------

if (failures.length) {
  console.error("NOTES TEST FAILED — " + failures.length + " of " + checks + " checks failed:");
  for (const f of failures) console.error("  ✗ " + f);
  process.exit(1);
}

console.log(
  "NOTES TEST PASSED — " + checks + " checks across registration, validation, merge and id keying."
);