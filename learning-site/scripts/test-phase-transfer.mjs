// Correctness test for the single-phase export and import.
//
// WHY THIS EXISTS
// `exportPhase` narrows a whole-profile backup down to the ids one phase owns.
// Narrowing is where this feature can go quietly wrong: a filter that misses a
// key drops the reader's note, a filter that is too wide drags a second phase's
// progress along, and a merge that overwrites instead of unioning destroys work
// on the machine the file was carried TO. None of those produces an error — the
// import reports success in every case.
//
// So the checks below are weighted the same way `test-data.mjs` is: the happy
// round trip is one check, and the rest are the ways a scoped export can be
// wrong while looking right.
//
// The two properties that matter most, and that are asserted directly:
//   1. A phase file is a VALID BACKUP, so `inspect` reads it with no special
//      case. If this ever stops being true the feature has forked the format.
//   2. Importing is ADDITIVE. It can never un-tick or delete, so a phase file
//      cannot harm the machine it lands on.
//
// Run: npm run test:phase-transfer   (from learning-site/)

import {
  exportPhase,
  importPhase,
  inspect,
  readKey,
  suggestedPhaseFilename,
  FORMAT,
  VERSION,
  PHASE_FORMAT,
} from "../src/lib/transfer.js";

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

function fakeStorage(seed = {}) {
  const map = new Map(Object.entries(seed));
  let failOn = null;
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => {
      if (failOn && k === failOn) throw new Error("QuotaExceededError");
      map.set(k, String(v));
    },
    removeItem: (k) => map.delete(k),
    _map: map,
    _failOnWriteOf(k) {
      failOn = k;
    },
  };
}

// A two-phase world, shaped like the real generated data: a phase owns checklist
// items and practice tasks, both of which live in the SAME progress map.
const phaseA = {
  id: "it-01-computer-fundamentals",
  title: "Phase 1 — Computer Fundamentals",
  checklist: [{ id: "it-01-hardware" }, { id: "it-01-os" }],
  tasks: [{ id: "it-01-t01" }, { id: "it-01-t02" }],
};
const phaseB = {
  id: "it-02-operating-systems",
  title: "Phase 2 — Operating Systems",
  checklist: [{ id: "it-02-files" }],
  tasks: [{ id: "it-02-t01" }],
};

// A storage holding work in BOTH phases, plus profile-shaped keys that must not
// travel with a phase.
function seeded() {
  return fakeStorage({
    "cs-roadmap:progress:v1": JSON.stringify({
      "it-01-hardware": true,
      "it-01-t01": true,
      "it-02-files": true,
      "it-02-t01": true,
    }),
    "cs-roadmap:lesson-sections:v1": JSON.stringify({
      "it-01-computer-fundamentals#what-is-a-computer": true,
      "it-01-computer-fundamentals#storage": true,
      "it-02-operating-systems#kernels": true,
    }),
    "cs-roadmap:notes:v1": JSON.stringify({
      "it-01-computer-fundamentals": {
        note: "My note for phase 1",
        answers: { "it-01-t01": "Answer one" },
      },
      "it-02-operating-systems": { note: "Someone else's note", answers: {} },
    }),
    "cs-roadmap:reading:v1": JSON.stringify({
      lastTrackId: "it",
      lastPhaseId: "it-01-computer-fundamentals",
      lastSection: {},
    }),
    "cs-roadmap:portfolio:v1": JSON.stringify([
      { id: "p1", title: "A portfolio piece" },
    ]),
    "cs-roadmap:schedule:v1": JSON.stringify({ it: "2026-01-05" }),
    "cs-roadmap:energy-mode:v1": JSON.stringify("normal"),
  });
}

// --- 1. the document is a real backup ---------------------------------------
{
  const out = exportPhase(seeded(), phaseA, "2026-09-16T12:00:00.000Z");
  ok(out.ok, "exportPhase reports ok");
  eq(out.payload.format, FORMAT, "phase file carries the backup format");
  eq(out.payload.version, VERSION, "phase file carries the current version");
  eq(out.payload.kind, PHASE_FORMAT, "phase file names its kind");
  eq(out.payload.phase.id, phaseA.id, "phase file names the phase it came from");

  // THE PROPERTY THAT MATTERS: the existing importer reads it with no special
  // case. If this fails, the feature has forked the format and every future
  // change to validation would have to be made twice.
  const verdict = inspect(out.payload);
  ok(verdict.ok, "the existing inspect() accepts a phase file", verdict.error);
  eq(verdict.summary.filter((s) => s.accepted).length > 0, true, "inspect found accepted keys");
}

// --- 2. narrowing is exact, and keyed by id not position --------------------
{
  const out = exportPhase(seeded(), phaseA, "2026-09-16T12:00:00.000Z");
  const prog = out.payload.data["cs-roadmap:progress:v1"];
  eq(
    Object.keys(prog).sort(),
    ["it-01-hardware", "it-01-t01"],
    "progress carries this phase's ids only, checklist and task alike"
  );
  ok(!("it-02-files" in prog), "phase 2 progress did not travel with phase 1");

  const sections = out.payload.data["cs-roadmap:lesson-sections:v1"];
  eq(
    Object.keys(sections).sort(),
    ["it-01-computer-fundamentals#storage", "it-01-computer-fundamentals#what-is-a-computer"],
    "section ticks are filtered by phase-id prefix"
  );
  ok(
    !("it-02-operating-systems#kernels" in sections),
    "another phase's section ticks did not travel"
  );

  const notes = out.payload.data["cs-roadmap:notes:v1"];
  eq(Object.keys(notes), [phaseA.id], "notes carry exactly this phase's entry");
  eq(notes[phaseA.id].note, "My note for phase 1", "the note itself is preserved");
  eq(
    notes[phaseA.id].answers["it-01-t01"],
    "Answer one",
    "the answer to a practice task is preserved"
  );
  ok(
    !("it-02-operating-systems" in notes),
    "another phase's note did not travel"
  );
}

// --- 3. profile-shaped keys are deliberately absent -------------------------
{
  const out = exportPhase(seeded(), phaseA, "2026-09-16T12:00:00.000Z");
  for (const key of [
    "cs-roadmap:portfolio:v1",
    "cs-roadmap:applications:v1",
    "cs-roadmap:schedule:v1",
    "cs-roadmap:energy-mode:v1",
    "cs-roadmap:reading-size:v1",
    "cs-roadmap:time-budget:v1",
  ]) {
    ok(!(key in out.payload.data), "profile key not exported: " + key);
  }
}

// --- 4. reading position travels only when it is this phase -----------------
{
  const inPhase = exportPhase(seeded(), phaseA, "2026-09-16T12:00:00.000Z");
  ok(
    "cs-roadmap:reading:v1" in inPhase.payload.data,
    "reading position travels when this phase is the one being read"
  );

  // The same storage, but the reader is in phase 2. Exporting phase 1 must not
  // drag "you were in phase 1" along, because it is false.
  const stamped = seeded();
  stamped.setItem(
    "cs-roadmap:reading:v1",
    JSON.stringify({ lastTrackId: "it", lastPhaseId: phaseB.id, lastSection: {} })
  );
  const other = exportPhase(stamped, phaseA, "2026-09-16T12:00:00.000Z");
  ok(
    !("cs-roadmap:reading:v1" in other.payload.data),
    "reading position is omitted when it names a different phase"
  );
}

// --- 5. a phase with no work yet produces a valid but empty file ------------
{
  const empty = exportPhase(fakeStorage({}), phaseA, "2026-09-16T12:00:00.000Z");
  ok(empty.ok, "exporting an untouched phase still succeeds");
  eq(empty.payload.data, {}, "an untouched phase exports no keys");
  // `inspect` refuses a document with no recognised data, which is correct: there
  // is nothing to import. Asserted so the empty case is a known outcome rather
  // than a surprise at the UI layer.
  const verdict = inspect(empty.payload);
  ok(!verdict.ok, "an empty phase file is refused by inspect rather than half-imported");
}

// --- 6. a corrupt unrelated key does not block the phase export -------------
{
  const storage = seeded();
  // A key this module does not scope, holding something unparseable. A phase
  // export is a convenience; it must not fail because of a key it never reads.
  storage.setItem("cs-roadmap:portfolio:v1", "{not json");
  const out = exportPhase(storage, phaseA, "2026-09-16T12:00:00.000Z");
  ok(out.ok, "a corrupt unrelated key does not fail the phase export");
  ok(
    "cs-roadmap:progress:v1" in out.payload.data,
    "the phase data still exported despite the corrupt unrelated key"
  );

  // But a corrupt key this module DOES scope contributes nothing rather than
  // throwing, and the omission is visible in the counts.
  const scoped = seeded();
  scoped.setItem("cs-roadmap:progress:v1", "{{{");
  const partial = exportPhase(scoped, phaseA, "2026-09-16T12:00:00.000Z");
  ok(partial.ok, "a corrupt scoped key does not throw");
  ok(
    !("cs-roadmap:progress:v1" in partial.payload.data),
    "a corrupt scoped key is omitted rather than exported as garbage"
  );
  ok(
    "cs-roadmap:notes:v1" in partial.payload.data,
    "the other scoped keys still export"
  );
}

// --- 7. import is additive and can never destroy ----------------------------
{
  const source = exportPhase(seeded(), phaseA, "2026-09-16T12:00:00.000Z");

  // The target machine already has DIFFERENT work in the same phase, plus work
  // in a phase the file does not mention.
  const target = fakeStorage({
    "cs-roadmap:progress:v1": JSON.stringify({ "it-01-os": true, "it-02-files": true }),
    "cs-roadmap:notes:v1": JSON.stringify({
      "it-01-computer-fundamentals": { note: "Target machine note", answers: {} },
      "it-03-networking-basics": { note: "Untouched", answers: {} },
    }),
  });

  const res = importPhase(source.payload, target);
  ok(res.ok, "import into a machine with existing work succeeds", res.error);

  const prog = JSON.parse(target.getItem("cs-roadmap:progress:v1"));
  ok(prog["it-01-hardware"], "the imported phase's progress landed");
  ok(prog["it-01-t01"], "the imported phase's task progress landed");
  ok(prog["it-01-os"], "EXISTING progress in the same phase was not removed");
  ok(prog["it-02-files"], "progress in an unrelated phase was not removed");

  const notes = JSON.parse(target.getItem("cs-roadmap:notes:v1"));
  ok(
    "it-03-networking-basics" in notes,
    "a note in a phase the file never mentioned survived the import"
  );
  // Existing wins on a collision, matching mergeValue's rule in the full import:
  // importing twice is a no-op, and the machine you are sitting at is the one
  // whose writing is current.
  eq(
    notes["it-01-computer-fundamentals"].note,
    "Target machine note",
    "existing note wins on a collision rather than being overwritten"
  );
}

// --- 8. importing the same file twice is a no-op ----------------------------
{
  const source = exportPhase(seeded(), phaseA, "2026-09-16T12:00:00.000Z");
  const target = fakeStorage({});
  importPhase(source.payload, target);
  const afterFirst = target.getItem("cs-roadmap:progress:v1");
  const res = importPhase(source.payload, target);
  ok(res.ok, "a second import succeeds");
  eq(
    target.getItem("cs-roadmap:progress:v1"),
    afterFirst,
    "importing the same phase file twice changes nothing"
  );
}

// --- 9. rejection cases -----------------------------------------------------
{
  const storage = fakeStorage({});
  const bad = importPhase({ format: "something-else" }, storage);
  ok(!bad.ok, "a non-backup object is refused");

  const wrongVersion = importPhase(
    { format: FORMAT, version: VERSION + 1, data: { "cs-roadmap:progress:v1": {} } },
    storage
  );
  ok(!wrongVersion.ok, "a version mismatch is refused rather than half-read");

  const invalid = importPhase(
    {
      format: FORMAT,
      version: VERSION,
      data: { "cs-roadmap:progress:v1": { "task-id": "yes" } },
    },
    storage
  );
  ok(!invalid.ok, "a key that fails validation is refused whole");
  eq(
    storage.getItem("cs-roadmap:progress:v1"),
    null,
    "nothing was written by a refused import"
  );

  // A key present but unreadable on the target: refuse rather than overwrite.
  const unreadable = fakeStorage({ "cs-roadmap:progress:v1": "not json at all" });
  const source = exportPhase(seeded(), phaseA, "2026-09-16T12:00:00.000Z");
  const res = importPhase(source.payload, unreadable);
  ok(!res.ok, "an unreadable existing value is refused rather than overwritten");
  eq(
    unreadable.getItem("cs-roadmap:progress:v1"),
    "not json at all",
    "the unreadable existing value was left exactly as it was"
  );
}

// --- 10. a write failure is reported, and says what already landed ----------
{
  const source = exportPhase(seeded(), phaseA, "2026-09-16T12:00:00.000Z");
  const target = fakeStorage({});
  target._failOnWriteOf("cs-roadmap:notes:v1");
  const res = importPhase(source.payload, target);
  ok(!res.ok, "a storage failure fails the import");
  ok(
    /part-way/.test(res.error || ""),
    "the failure says the import stopped part-way",
    res.error
  );
  ok(Array.isArray(res.written), "the failure reports which keys were written");
}

// --- 11. the filename names the phase and nothing else ----------------------
{
  const name = suggestedPhaseFilename(phaseA, "2026-09-16T12:00:00.000Z");
  ok(name.startsWith("cs-roadmap-it-01-computer-fundamentals-"), "filename names the phase", name);
  ok(name.endsWith(".json"), "filename is json", name);
  ok(!/\s/.test(name), "filename has no whitespace", name);
  // The phase id is already kebab-case; sanitising must not mangle a real one.
  eq(
    suggestedPhaseFilename(phaseA, "2026-09-16T12:00:00.000Z"),
    "cs-roadmap-it-01-computer-fundamentals-2026-09-16.json",
    "filename is exactly the phase id plus a date"
  );
}

// --- 12. counts describe what actually travelled ----------------------------
{
  const out = exportPhase(seeded(), phaseA, "2026-09-16T12:00:00.000Z");
  eq(out.counts["cs-roadmap:progress:v1"], 2, "counts report 2 progress ids");
  eq(out.counts["cs-roadmap:lesson-sections:v1"], 2, "counts report 2 section ticks");
  eq(out.counts["cs-roadmap:notes:v1"], 1, "counts report 1 phase of notes");
}

// --- report -----------------------------------------------------------------
console.log("");
if (failures.length) {
  console.log("PHASE TRANSFER TEST FAILED — " + failures.length + " of " + checks + " checks failed:");
  for (const f of failures) console.log("  ✗ " + f);
  process.exit(1);
}
console.log(
  "PHASE TRANSFER TEST PASSED — " +
    checks +
    " checks across narrowing, additive merge, rejection and filenames."
);
