// Guard: every verdict recorder in scripts/ must be invoked by CI.
//
// WHY THIS EXISTS.
//
// The "Recorded verdicts still place" step listed two of the four recorders that
// existed. The other two -- record-it-verdicts-2.mjs and record-cyber-verdicts-dns.mjs --
// ran fine when a human typed them and were run by nobody otherwise. A recorder that CI
// does not invoke is a set of verdicts that nothing re-checks, and the failure is silent:
// the verification document keeps passing every other guard, because all of those check
// the rows that ARE there, and none of them asks whether the rows are still reproducible
// from the recorders that produced them.
//
// This is D-056 applied to the gating path itself. Counting the recorders I remembered
// could not find the two I had forgotten, so this guard enumerates the SUBSTRATE -- the
// files on disk -- and requires each to appear in the workflow. Adding a recorder and
// forgetting to wire it now fails CI instead of quietly widening the unchecked surface.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const CI = path.join(ROOT, ".github", "workflows", "ci.yml");

// A "recorder" is a script whose name says it writes verdicts into a verification
// document. Derived from the directory listing, never from a hand-written list.
const RECORDER = /^record-.*verdicts.*\.mjs$/;

const scriptsDir = path.join(ROOT, "scripts");
const recorders = fs
  .readdirSync(scriptsDir)
  .filter((f) => RECORDER.test(f))
  .sort();

if (recorders.length === 0) {
  console.error("RECORDER WIRING FAILED — no recorder scripts found at all.");
  console.error("  Either scripts/ is not where this guard thinks, or the naming convention changed.");
  process.exit(1);
}

const ci = fs.readFileSync(CI, "utf8");
const missing = recorders.filter((f) => !ci.includes(f));

console.log(`Verdict recorders on disk: ${recorders.length}`);
for (const f of recorders) {
  console.log(`  ${missing.includes(f) ? "NOT WIRED" : "wired    "}  scripts/${f}`);
}

if (missing.length) {
  console.error("");
  console.error(`RECORDER WIRING FAILED — ${missing.length} recorder(s) are never run by CI:`);
  for (const f of missing) console.error(`  scripts/${f}`);
  console.error("");
  console.error("  A recorder CI does not run is a set of verdicts nothing re-checks.");
  console.error("  Add them to the 'Recorded verdicts still place (both tracks)' step.");
  process.exit(1);
}

console.log("");
console.log("Every verdict recorder is invoked by CI.");
