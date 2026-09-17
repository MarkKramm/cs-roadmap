// Controls for audit-band-plausibility.mjs.
//
// Controls 4, 5 and 6 are the three cases the FIRST version of this guard got wrong. They
// are here as PASSING controls -- not because those bands were in doubt, but because a
// future edit that reintroduces a list-length proxy would flag them, and this suite is what
// would catch that. A regression here is a guard becoming wrong about correct content.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const GUARD = "scripts/audit-band-plausibility.mjs";

const SNAPSHOT = new Map();
const snapshot = (f) => {
  if (!SNAPSHOT.has(f)) SNAPSHOT.set(f, fs.readFileSync(f, "utf8"));
  return SNAPSHOT.get(f);
};

const run = () => {
  try {
    return { code: 0, out: execFileSync("node", [GUARD], { encoding: "utf8", cwd: ROOT }) };
  } catch (e) {
    return { code: e.status ?? 1, out: (e.stdout || "") + (e.stderr || "") };
  }
};

const results = [];
// Mutates a real phase file, runs the guard, restores in `finally`. Never a process-level
// restore -- that silently discarded an author's edit earlier in this project (D-062).
const control = (name, file, mutate, expectFail, allowNoop = false) => {
  const target = path.join(ROOT, "career-roadmaps", file);
  const original = snapshot(target);
  fs.writeFileSync(target, original, "utf8");
  const mutated = mutate(original);
  if (mutated === original && !allowNoop) throw new Error(`fixture for "${name}" changed nothing`);
  fs.writeFileSync(target, mutated, "utf8");
  let r;
  try {
    r = run();
  } finally {
    fs.writeFileSync(target, original, "utf8");
  }
  results.push({ name, ok: (r.code !== 0) === expectFail, out: r.out });
};

const IT01 = "it-roadmap/01-phase-computer-fundamentals.md";
const CYBER05 = "cybersec-roadmap/05-phase-specialization-choice.md";

// 1. The real repository passes.
control("the real repository -> must PASS", IT01, (t) => t, false, true);

// 2. A band the UI cannot reach. lib/today.js switches on four values; this one falls
//    through every branch and the task is silently unreachable.
control("an unknown band value -> must FAIL", IT01,
  (t) => t.replace(/id: it-01-t01 band: \w+/, "id: it-01-t01 band: medium"), true);

// 3. An unknown energy level -- same class, different field.
control("an unknown energy value -> must FAIL", IT01,
  (t) => t.replace(/id: it-01-t01 band: quick energy: \w+/, "id: it-01-t01 band: quick energy: medium"), true);

// 4. FALSE-POSITIVE GUARD. "Write down: CPU model and core count, RAM capacity, storage
//    type and size, ..." -- a quick task listing fields to transcribe. The first version
//    flagged this; it must stay silent.
control("a quick task listing fields to transcribe -> must PASS", IT01,
  (t) => t.replace(/RAM capacity, storage type and size/, "RAM capacity, storage type and size, plus more, and more,"), false);

// 5. FALSE-POSITIVE GUARD. "Record your IP address, subnet mask, default gateway, DHCP
//    server, DNS server, and MAC address." -- same shape.
control("a quick task recording six field values -> must PASS", "it-roadmap/03-phase-networking-basics.md",
  (t) => t.replace(/DNS server, and MAC address/, "DNS server, MAC address, and link speed"), false);

// 6. FALSE-POSITIVE GUARD. "Do one mini-task from each path:" is a lead-in whose work is in
//    its four sub-bullets. The first version judged the lead-in alone and called `deep`
//    implausible. It must stay silent while the sub-bullets exist.
control("a deep task whose work is in sub-bullets -> must PASS", CYBER05,
  (t) => t.replace(/Do one mini-task from each path:/, "Do one mini-task from each path, chosen deliberately:"), false);

// 7. But a lead-in with NOTHING under it is a real defect: a band describing no work.
//    NOTE ON THE FIXTURE: the sub-bullets are indented with THREE spaces in this file, not
//    four. The first draft of this fixture assumed four, changed nothing, and threw -- a
//    fixture error reported against working code, which is the eighth time that has
//    happened here (D-049, D-058, D-065, D-067). `allowNoop` is deliberately left false so
//    a fixture that silently stops matching fails loudly instead of passing vacuously.
control("a lead-in with no sub-bullets -> must FAIL", CYBER05,
  (t) => t.replace(/(1\. Do one mini-task from each path: <!-- id: cyber-05-t01 band: deep energy: high -->\n)(?: {1,6}- .*\n)+/, "$1"), true);

const restored = [...SNAPSHOT.entries()].every(([f, orig]) => fs.readFileSync(f, "utf8") === orig);
console.log("");
for (const r of results) console.log(`  ${r.ok ? "pass" : "FAIL"}  ${r.name}`);
console.log("");
console.log(`  all ${SNAPSHOT.size} phase files restored byte-identical: ${restored}`);
const bad = results.filter((r) => !r.ok);
if (bad.length) {
  console.log("");
  for (const b of bad) console.log(b.out.split("\n").slice(-10).join("\n"));
}
const ok = bad.length === 0 && restored;
console.log(ok ? "ALL CONTROLS PASS" : `${bad.length} CONTROL(S) FAILED`);
process.exit(ok ? 0 : 1);
