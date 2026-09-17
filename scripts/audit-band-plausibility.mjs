// Guard: a duration band must be plausible for the task it is attached to.
//
// WHY THIS EXISTS
//
// 283 practice tasks carry an authored `band:` (quick / focused / deep / ongoing) and
// `energy:` value. Nobody has timed any of them, and that is recorded honestly in three
// places. But "an estimate nobody has checked" and "an estimate nobody *can* check" are
// different claims, and this guard is the difference.
//
// It cannot know how long a task takes a human. It CAN know the task's own shape, and
// reject a band that no task of that shape could have.
//
// ---------------------------------------------------------------------------
// THE FIRST VERSION OF THIS GUARD WAS WRONG THREE TIMES OUT OF THREE. KEEPING THE
// RECORD, BECAUSE THE MISTAKE IS THE INTERESTING PART.
//
// It scored a task by counting conjunctions and sentence breaks in the task line. It
// flagged:
//
//   - `it-01-t01` (quick) -- "Write down: CPU model and core count, RAM capacity,
//     storage type and size, OS version and build, and Wi-Fi adapter model."
//   - `it-03-t02` (quick) -- "Record your IP address, subnet mask, default gateway,
//     DHCP server, DNS server, and MAC address."
//   - `cyber-05-t01` (deep) -- a one-line lead-in to four sub-bullets.
//
// All three bands are CORRECT. The proxy was measuring LIST LENGTH and calling it WORK.
// Transcribing six field values off one screen is a quick task however many commas it
// contains, and a lead-in line is not the task when the task is its sub-bullets.
//
// So the lesson, which is the same one D-065 records in a different costume: **a check
// built on a proxy must be validated against real cases before it is trusted, and this
// one was not.** What follows is the narrower rule that survived.
// ---------------------------------------------------------------------------
//
// WHAT SURVIVED
//
// Only two things are checkable without a stopwatch and without guessing at duration:
//
//   1. **Vocabulary.** A band or energy value the UI does not know about is a defect,
//      full stop. `lib/today.js` switches on exactly four bands and three energy levels;
//      anything else is silently unreachable.
//   2. **A task with no content.** A band asserts something about an amount of work. A
//      task line with no verb-shaped instruction beyond a lead-in, and no sub-bullets
//      under it, asserts nothing -- there is nothing there to take any amount of time.
//
// Everything else is judgement, and judgement belongs to the author with the UI note that
// already says these are estimates. Widening this guard to cover "is `focused` right for
// this task" would require the timing data nobody has, which is the gap this guard exists
// to keep visible rather than to paper over.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const TRACKS = ["it-roadmap", "cybersec-roadmap", "advance-roadmap"];
const BANDS = ["quick", "focused", "deep", "ongoing"];
const ENERGY = ["low", "normal", "high"];

const findings = [];
const dist = {};
let total = 0;

for (const track of TRACKS) {
  const dir = path.join(ROOT, "career-roadmaps", track);
  for (const f of fs.readdirSync(dir).filter((x) => /^\d{2}-phase.*\.md$/.test(x))) {
    const lines = fs.readFileSync(path.join(dir, f), "utf8").split("\n");
    lines.forEach((line, i) => {
      const m = line.match(/^(\s*(?:\d+\.|[-*])\s+)(.*?)<!--\s*id:\s*([\w-]+)\s+band:\s*(\w+)\s+energy:\s*(\w+)\s*-->/);
      if (!m) return;
      const [, marker, text, id, band, energy] = m;
      total++;
      dist[band] = (dist[band] || 0) + 1;
      const clean = text.replace(/\*\*|_|\*/g, "").trim();

      // 1. Vocabulary -- exact, no judgement.
      if (!BANDS.includes(band)) {
        findings.push({ track, file: f, line: i + 1, id, why: `band \`${band}\` is not one the UI knows (${BANDS.join(" / ")})`, text: clean.slice(0, 110) });
      }
      if (!ENERGY.includes(energy)) {
        findings.push({ track, file: f, line: i + 1, id, why: `energy \`${energy}\` is not one the UI knows (${ENERGY.join(" / ")})`, text: clean.slice(0, 110) });
      }

      // 2. A task with nothing in it. Sub-bullets count as content, so a lead-in is
      //    judged only when nothing follows it.
      const indent = marker.match(/^\s*/)[0].length;
      let hasChild = false;
      for (let j = i + 1; j < lines.length; j++) {
        const next = lines[j];
        if (!next.trim()) continue;
        const nextIndent = next.match(/^\s*/)[0].length;
        if (nextIndent > indent && /^\s*[-*\d]/.test(next)) { hasChild = true; }
        break;
      }
      // "Do one mini-task from each path:" is a lead-in; on its own it asks for nothing.
      const isLeadIn = /:\s*$/.test(clean) && clean.split(/\s+/).length <= 12;
      if (isLeadIn && !hasChild) {
        findings.push({ track, file: f, line: i + 1, id, why: "the task is a lead-in with nothing under it, so no band can describe it", text: clean.slice(0, 110) });
      }
      if (clean.length < 15) {
        findings.push({ track, file: f, line: i + 1, id, why: `the task text is ${clean.length} characters -- too short to be a task`, text: clean.slice(0, 110) });
      }
    });
  }
}

console.log(`Banded practice tasks scanned: ${total}`);
console.log(`Distribution: ${Object.entries(dist).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(", ")}`);
console.log("");
console.log("Scope: vocabulary and empty tasks only. NOT checked: whether a band is the RIGHT");
console.log("band. That needs timed tasks, which nobody has (see the note this guard prints).");
console.log("");
if (!findings.length) {
  console.log("BAND PLAUSIBILITY OK — every band is a band the UI knows, and every task has content.");
  console.log("");
  console.log("NOTE: this does NOT mean the bands are accurate. Nobody has timed these tasks, and");
  console.log("this guard cannot close that gap. It rejects a band that is unreachable or attached");
  console.log("to nothing; it does not and cannot confirm that `focused` means what a reader expects.");
  process.exit(0);
}
console.error(`BAND PLAUSIBILITY FAILED — ${findings.length} defect(s):`);
console.error("");
for (const x of findings) {
  console.error(`  ${x.track}/${x.file}:${x.line}  [${x.id}]`);
  console.error(`      ${x.text}`);
  console.error(`      WHY: ${x.why}`);
}
process.exit(1);
