// Correctness test for backup export and import.
//
// WHY THIS EXISTS
// `transfer.js` is the only code in the site that can DESTROY the reader's data.
// Everything else adds to it; an import overwrites eight localStorage keys at
// once. On a 34–112 week curriculum that is potentially years of checklist
// progress, portfolio entries and job applications, and the failure is silent:
// a malformed file that is accepted halfway leaves the reader with a
// half-restored state that looks like data loss and is data loss.
//
// So this suite is built around the rejection cases rather than the happy path.
// A round trip that works proves the format is self-consistent; the cases that
// matter are the ones where a bad file must be refused WHOLE rather than
// partially applied, and where a merge must never un-tick something the reader
// finished.
//
// The module is pure — it takes storage as a parameter rather than reaching for
// `window` — so all of this runs under Node with a fake storage object and no
// DOM. That is the reason it was written that way.
//
// Run: npm run test:data   (from learning-site/)

import { exportAll, importAll, inspect, mergeValue, readKey, suggestedFilename, KEYS, FORMAT, VERSION } from "../src/lib/transfer.js";

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

// A storage stub that behaves like localStorage: string values in, string
// values out, and a quota that can be made to fail on demand.
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
    _raw: (k) => map.get(k),
  };
}

// A representative "before" state: one key of every shape the site writes.
const POPULATED = {
  "cs-roadmap:progress:v1": JSON.stringify({ "it-01-c01": true, "it-01-c02": true }),
  "cs-roadmap:lesson-sections:v1": JSON.stringify({ "it-01#what-a-computer-is": true }),
  "cs-roadmap:portfolio:v1": JSON.stringify([
    { id: "p1", title: "Home lab", phaseId: "it-01", repoUrl: "", liveUrl: "", status: "done", notes: "", createdAt: "2026-01-01T00:00:00.000Z" },
  ]),
  "cs-roadmap:applications:v1": JSON.stringify([
    { id: "a1", company: "Acme", role: "Helpdesk", source: "", url: "", appliedOn: "2026-02-01", status: "applied", followUpOn: "", notes: "" },
  ]),
  "cs-roadmap:schedule:v1": JSON.stringify({ it: "2026-01-05" }),
  "cs-roadmap:reading:v1": JSON.stringify({
    lastTrackId: "it",
    lastPhaseId: "it-01",
    lastSection: { "it-01": { id: "what-a-computer-is", text: "What a computer is" } },
  }),
  "cs-roadmap:energy-mode:v1": JSON.stringify("normal"),
  "cs-roadmap:reading-size:v1": JSON.stringify("m"),
  "cs-roadmap:notes:v1": JSON.stringify({
    "it-01-computer-fundamentals": {
      note: "What confused me was the difference between RAM and storage.",
      answers: { "it-01-computer-fundamentals-t01": "CPU, RAM, disk, OS build." },
    },
  }),
};

// ---- export ---------------------------------------------------------------

{
  const s = fakeStorage(POPULATED);
  const out = exportAll(s, "2026-03-01T12:00:00.000Z");
  ok(out.ok, "export: reports ok");
  eq(out.skipped, [], "export: nothing skipped from a clean state");
  eq(out.payload.format, FORMAT, "export: carries the format marker");
  eq(out.payload.version, VERSION, "export: carries the version");
  eq(out.payload.exportedAt, "2026-03-01T12:00:00.000Z", "export: stamps the time it was given");
  eq(Object.keys(out.payload.data).length, 9, "export: captured all nine keys");
  ok(out.payload.data["cs-roadmap:progress:v1"]["it-01-c01"] === true, "export: progress survived");
}

{
  // A key that was never written is omitted, not written as null. The file
  // should describe what the reader has, not the schema.
  const s = fakeStorage({ "cs-roadmap:progress:v1": JSON.stringify({ a: true }) });
  const out = exportAll(s, "2026-03-01T12:00:00.000Z");
  eq(Object.keys(out.payload.data), ["cs-roadmap:progress:v1"], "export: absent keys are omitted");
  eq(out.skipped, [], "export: absent keys are not reported as skipped");
}

{
  // A key holding unparseable bytes is skipped and reported, never exported.
  // Copying a corrupt value into a backup just moves the corruption somewhere
  // the reader will trust more.
  const s = fakeStorage({ "cs-roadmap:progress:v1": "{not json" });
  const out = exportAll(s, "2026-03-01T12:00:00.000Z");
  eq(out.skipped, ["cs-roadmap:progress:v1"], "export: corrupt JSON is skipped and reported");
  ok(!("cs-roadmap:progress:v1" in out.payload.data), "export: corrupt value is not written into the backup");
}

{
  // Right JSON, wrong shape — a progress map containing a false value.
  const s = fakeStorage({ "cs-roadmap:progress:v1": JSON.stringify({ a: false }) });
  const out = exportAll(s, "2026-03-01T12:00:00.000Z");
  eq(out.skipped, ["cs-roadmap:progress:v1"], "export: a value failing validation is skipped");
}

{
  // Reading throws (storage disabled). Export must still produce a document.
  const s = {
    getItem: () => {
      throw new Error("denied");
    },
  };
  const out = exportAll(s, "2026-03-01T12:00:00.000Z");
  ok(out.ok, "export: survives a storage read that throws");
  eq(Object.keys(out.payload.data).length, 0, "export: nothing captured when nothing is readable");
  eq(out.skipped.length, 9, "export: every unreadable key is reported");
}

// ---- inspect: the rejection cases -----------------------------------------

{
  ok(!inspect(null).ok, "inspect: rejects null");
  ok(!inspect("a string").ok, "inspect: rejects a non-object");
  ok(!inspect([]).ok, "inspect: rejects an array");
  ok(!inspect({}).ok, "inspect: rejects an object with no format marker");
}

{
  // The single most important case: a file from some other app, or a hand-edited
  // file, must be refused rather than partially applied.
  const bad = { format: "something-else", version: 1, data: { "cs-roadmap:progress:v1": { a: true } } };
  const v = inspect(bad);
  ok(!v.ok, "inspect: rejects a foreign format");
  ok(v.error.includes("not a CS Roadmap backup"), "inspect: explains the format mismatch");
}

{
  // A FUTURE version must be refused, not read greedily: it may carry keys this
  // build would drop, and a partial read of a backup is worse than none.
  const future = { format: FORMAT, version: VERSION + 1, data: { "cs-roadmap:progress:v1": { a: true } } };
  const v = inspect(future);
  ok(!v.ok, "inspect: refuses a newer version");
  ok(v.error.includes("newer backup"), "inspect: explains why a newer version is refused");
}

{
  const noData = { format: FORMAT, version: VERSION };
  ok(!inspect(noData).ok, "inspect: rejects a payload with no data section");
}

{
  // ONE bad key refuses the WHOLE file. This is the central guarantee.
  const mixed = {
    format: FORMAT,
    version: VERSION,
    data: {
      "cs-roadmap:progress:v1": { a: true },
      "cs-roadmap:portfolio:v1": [{ id: "p1" }], // missing required `title`
    },
  };
  const v = inspect(mixed);
  ok(!v.ok, "inspect: one invalid key refuses the whole payload");
  ok(v.error.includes("half-restored"), "inspect: says why partial import is refused");
  ok(v.summary.some((r) => r.key === "cs-roadmap:progress:v1" && r.accepted), "inspect: the valid key is still reported");
  ok(v.summary.some((r) => r.key === "cs-roadmap:portfolio:v1" && !r.accepted), "inspect: the invalid key is reported as refused");
}

{
  // An unknown key is dropped with a note, not treated as an error — that is
  // what makes a future version's file readable rather than unusable.
  const extra = {
    format: FORMAT,
    version: VERSION,
    data: { "cs-roadmap:progress:v1": { a: true }, "cs-roadmap:something-new:v1": { x: 1 } },
  };
  const v = inspect(extra);
  ok(v.ok, "inspect: an unknown key does not fail the import");
  ok(!("cs-roadmap:something-new:v1" in v.data), "inspect: the unknown key is dropped");
  ok(v.summary.some((r) => r.key === "cs-roadmap:something-new:v1" && !r.accepted), "inspect: the unknown key is disclosed");
}

{
  const empty = { format: FORMAT, version: VERSION, data: {} };
  ok(!inspect(empty).ok, "inspect: rejects a backup with no recognised data");
}

{
  // Validation of each shape, one at a time, through inspect.
  const cases = [
    ["cs-roadmap:progress:v1", { a: "yes" }, "progress must be true-valued"],
    ["cs-roadmap:progress:v1", [], "progress must be an object"],
    ["cs-roadmap:lesson-sections:v1", { a: 1 }, "section ticks must be true"],
    ["cs-roadmap:schedule:v1", { it: "05/01/2026" }, "schedule dates must be ISO"],
    ["cs-roadmap:energy-mode:v1", "turbo", "energy mode is a closed set"],
    ["cs-roadmap:reading-size:v1", "huge", "reading size is a closed set"],
    ["cs-roadmap:reading:v1", { lastTrackId: 1, lastPhaseId: "", lastSection: {} }, "reading ids are strings"],
    ["cs-roadmap:reading:v1", { lastTrackId: "", lastPhaseId: "", lastSection: { p: { id: "" } } }, "a section entry needs a non-empty id"],
    ["cs-roadmap:applications:v1", [{ id: "a1", company: "Acme" }], "an application needs a role"],
    ["cs-roadmap:portfolio:v1", "nope", "portfolio must be an array"],
  ];
  for (const [key, value, why] of cases) {
    const v = inspect({ format: FORMAT, version: VERSION, data: { [key]: value } });
    ok(!v.ok, "inspect rejects " + key + " when " + why);
  }
}

{
  // The valid shapes must pass, or the rejections above prove nothing.
  const good = {
    format: FORMAT,
    version: VERSION,
    data: {
      "cs-roadmap:progress:v1": { a: true },
      "cs-roadmap:lesson-sections:v1": { "it-01#x": true },
      "cs-roadmap:portfolio:v1": [{ id: "p1", title: "T" }],
      "cs-roadmap:applications:v1": [{ id: "a1", company: "C", role: "R" }],
      "cs-roadmap:schedule:v1": { it: "2026-01-05" },
      "cs-roadmap:reading:v1": { lastTrackId: "it", lastPhaseId: "it-01", lastSection: { "it-01": { id: "x", text: "X" } } },
      "cs-roadmap:energy-mode:v1": "high",
      "cs-roadmap:reading-size:v1": "l",
      "cs-roadmap:notes:v1": {
        "it-01-x": { note: "a note", answers: { "it-01-x-t01": "an answer" } },
      },
    },
  };
  const v = inspect(good);
  ok(v.ok, "inspect: accepts a fully valid payload", v.error);
  eq(Object.keys(v.data).length, 9, "inspect: accepts all nine keys");
}

// ---- round trip -----------------------------------------------------------

{
  const from = fakeStorage(POPULATED);
  const exported = exportAll(from, "2026-03-01T12:00:00.000Z");
  const serialised = JSON.stringify(exported.payload);
  const parsed = JSON.parse(serialised);

  const to = fakeStorage();
  const res = importAll(to, parsed, "replace");
  ok(res.ok, "round trip: import succeeds", res.error);
  eq(res.written.length, 9, "round trip: all nine keys were written");

  // Every key must be byte-identical after a JSON serialise/parse cycle.
  for (const { key } of KEYS) {
    // A key registered in KEYS but missing from the fixture is a gap in THIS
    // TEST, not a bug in the module. It was previously an unguarded
    // JSON.parse(undefined), which threw a stack trace naming neither the key
    // nor the reason and took the whole suite down with it — so the suite
    // reported nothing at all when the ninth key was added. Report it as a
    // failed check instead.
    if (!(key in POPULATED)) {
      ok(false, "round trip: " + key + " has no seed value in the fixture");
      continue;
    }
    eq(JSON.parse(to._raw(key)), JSON.parse(POPULATED[key]), "round trip: " + key + " survived unchanged");
  }
}

// ---- merge semantics ------------------------------------------------------
// The rule: union what the reader FINISHED or MADE; keep this machine's
// POSITION and PREFERENCES.

{
  // Progress unions — an import must never un-tick something.
  const merged = mergeValue(
    "cs-roadmap:progress:v1",
    { "it-01-c01": true },
    { "it-02-c01": true }
  );
  eq(merged, { "it-01-c01": true, "it-02-c01": true }, "merge: progress unions both sides");
}

{
  const merged = mergeValue("cs-roadmap:lesson-sections:v1", { "a#x": true }, { "b#y": true });
  eq(merged, { "a#x": true, "b#y": true }, "merge: section ticks union");
}

{
  // Portfolio unions by id, existing wins, so importing the same file twice
  // does not duplicate every entry.
  const merged = mergeValue(
    "cs-roadmap:portfolio:v1",
    [{ id: "p1", title: "Mine" }],
    [{ id: "p1", title: "Theirs" }, { id: "p2", title: "New" }]
  );
  eq(merged.length, 2, "merge: portfolio deduplicates by id");
  eq(merged[0].title, "Mine", "merge: the existing portfolio entry wins a collision");
  eq(merged[1].title, "New", "merge: a new portfolio entry is added");
}

{
  const merged = mergeValue(
    "cs-roadmap:applications:v1",
    [{ id: "a1", company: "Acme", role: "Helpdesk" }],
    [{ id: "a2", company: "Globex", role: "Support" }]
  );
  eq(merged.length, 2, "merge: applications union by id");
}

{
  // Idempotence: importing the same backup twice must change nothing the second
  // time. This is what makes a repeated import safe.
  const s = fakeStorage(POPULATED);
  const payload = exportAll(s, "2026-03-01T12:00:00.000Z").payload;
  const s2 = fakeStorage(POPULATED);
  importAll(s2, payload, "merge");
  const after1 = Object.fromEntries(KEYS.map(({ key }) => [key, s2._raw(key)]));
  importAll(s2, payload, "merge");
  const after2 = Object.fromEntries(KEYS.map(({ key }) => [key, s2._raw(key)]));
  eq(after2, after1, "merge: a second identical import is a no-op");
}

{
  // Position and preferences belong to THIS machine and must not be overwritten
  // by an import — yanking the reader back to another machine's place is the
  // bug this rule prevents.
  const merged = mergeValue(
    "cs-roadmap:reading:v1",
    { lastTrackId: "cyber", lastPhaseId: "cyber-05", lastSection: {} },
    { lastTrackId: "it", lastPhaseId: "it-01", lastSection: {} }
  );
  eq(merged.lastPhaseId, "cyber-05", "merge: reading position keeps this machine's place");

  eq(mergeValue("cs-roadmap:energy-mode:v1", "high", "low"), "high", "merge: energy mode keeps the current value");
  eq(mergeValue("cs-roadmap:reading-size:v1", "xl", "s"), "xl", "merge: reading size keeps the current value");
}

{
  // Schedule: one start date per track. The reader's existing date for a track
  // wins, but a track they had not started takes the incoming date.
  const merged = mergeValue(
    "cs-roadmap:schedule:v1",
    { it: "2026-01-05" },
    { it: "2025-01-05", cyber: "2026-06-01" }
  );
  eq(merged.it, "2026-01-05", "merge: an existing start date is not overwritten");
  eq(merged.cyber, "2026-06-01", "merge: a new track takes the imported start date");
}

{
  // Merge mode applied end to end: importing into a machine that already has
  // work must union rather than replace.
  const target = fakeStorage({
    "cs-roadmap:progress:v1": JSON.stringify({ "it-01-c01": true }),
  });
  const source = fakeStorage({
    "cs-roadmap:progress:v1": JSON.stringify({ "it-02-c01": true }),
    "cs-roadmap:energy-mode:v1": JSON.stringify("high"),
  });
  const payload = exportAll(source, "2026-03-01T12:00:00.000Z").payload;
  const res = importAll(target, payload, "merge");
  ok(res.ok, "merge import: succeeds", res.error);
  eq(
    JSON.parse(target._raw("cs-roadmap:progress:v1")),
    { "it-01-c01": true, "it-02-c01": true },
    "merge import: progress from both machines is kept"
  );
}

{
  // Replace mode is explicit and does overwrite.
  const target = fakeStorage({ "cs-roadmap:energy-mode:v1": JSON.stringify("low") });
  const source = fakeStorage({ "cs-roadmap:energy-mode:v1": JSON.stringify("high") });
  const payload = exportAll(source, "2026-03-01T12:00:00.000Z").payload;
  importAll(target, payload, "replace");
  eq(JSON.parse(target._raw("cs-roadmap:energy-mode:v1")), "high", "replace import: overwrites the preference");
}

// ---- import failure -------------------------------------------------------

{
  // A rejected payload writes NOTHING. This is the guarantee the whole module
  // is built around, so it is asserted on the storage itself.
  const target = fakeStorage({ "cs-roadmap:progress:v1": JSON.stringify({ keep: true }) });
  const bad = {
    format: FORMAT,
    version: VERSION,
    data: { "cs-roadmap:progress:v1": { a: true }, "cs-roadmap:schedule:v1": { it: "nope" } },
  };
  const res = importAll(target, bad, "merge");
  ok(!res.ok, "failed import: reports failure");
  eq(res.written, [], "failed import: wrote no keys");
  eq(JSON.parse(target._raw("cs-roadmap:progress:v1")), { keep: true }, "failed import: left existing data untouched");
}

{
  // Storage full part-way. The error must say what was already written rather
  // than pretending the import did not happen.
  const target = fakeStorage();
  target._failOnWriteOf("cs-roadmap:portfolio:v1");
  const source = fakeStorage(POPULATED);
  const payload = exportAll(source, "2026-03-01T12:00:00.000Z").payload;
  const res = importAll(target, payload, "replace");
  ok(!res.ok, "quota failure: reports failure");
  ok(res.written.length > 0, "quota failure: reports the keys written before it stopped");
  ok(res.error.includes("full or unavailable"), "quota failure: explains the cause");
}

// ---- misc -----------------------------------------------------------------

{
  eq(readKey(fakeStorage(), "cs-roadmap:progress:v1").present, false, "readKey: absent key is not present");
  eq(readKey(fakeStorage({ k: "{bad" }), "k").ok, false, "readKey: unparseable value is not ok");
  eq(readKey(fakeStorage({ k: "true" }), "k").value, true, "readKey: parses a scalar");
}

{
  const name = suggestedFilename("2026-03-01T12:00:00.000Z");
  ok(/^cs-roadmap-backup-\d{4}-\d{2}-\d{2}-\d{4}\.json$/.test(name), "filename: matches the expected shape", name);
  ok(name.includes("2026-03-01"), "filename: carries the date");
}

{
  // Every key the site actually uses must be in KEYS, or a backup would quietly
  // omit it. This is asserted against a literal list so adding a ninth storage
  // key without registering it fails here.
  eq(KEYS.length, 9, "registry: knows exactly the nine keys the site writes");
  eq(KEYS.map((k) => k.key).sort(), Object.keys(POPULATED).sort(), "registry: matches the keys in use");
}

// ---- result ---------------------------------------------------------------

if (failures.length) {
  console.error("DATA TEST FAILED — " + failures.length + " of " + checks + " checks failed:");
  for (const f of failures) console.error("  " + f);
  process.exit(1);
}

console.log(
  "DATA TEST PASSED — " + checks + " checks across export, validation, merge and import failure."
);