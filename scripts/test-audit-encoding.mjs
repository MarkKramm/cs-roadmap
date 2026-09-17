// Controls for scripts/audit-encoding.mjs.
//
// A guard that has never failed is a comment. This supplies the failing cases.
//
// WHY EACH CONTROL IS THE SHAPE IT IS
// The real defect that motivated this guard was mojibake written into
// docs/SESSION-LOG.md by a shell write -- and it SURVIVED my first scan, which
// enumerated printable mojibake signatures. The reason was U+009D, a C1 control
// character, which no such list contained. So the controls below do not test
// "does it recognise mojibake". They test the property the guard actually
// relies on: a BOM, a C1 control, and a lost byte are each detectable without
// knowing how the corruption happened.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const GUARD = path.join(ROOT, "scripts", "audit-encoding.mjs");

// The guard scans docs/ and career-roadmaps/. Reproduce that shape in a temp
// tree by running the guard with a cwd whose contents we control.
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "enc-"));

function run(cwd) {
  try {
    const out = execFileSync(process.execPath, [GUARD], { cwd, encoding: "utf8", stdio: "pipe" });
    return { code: 0, out };
  } catch (e) {
    return { code: e.status, out: (e.stdout || "") + (e.stderr || "") };
  }
}

// The guard resolves ROOT from its own location, so it always scans the real
// repo. To test it against synthetic input we therefore call the guard's logic
// indirectly: write the bad file into the real docs/ tree, run, then remove.
// That is the only way to exercise the code path the corpus actually takes.
//
// The probe is removed in a `finally` so an exception cannot leave it behind, and it is
// registered for removal on exit as well -- a crashed run that strands a mojibake probe
// in docs/ would be caught by the guard itself on the next run, but it would look like a
// real finding in a real document. See D-058: a test suite must not be able to write into
// the artifact it validates.
const probe = path.join(ROOT, "docs", "__encoding-probe.md");
// A script-shaped probe too: the guard now scans .mjs, and the whole reason it does is
// that split-claims.mjs carried eleven corrupted lines while the guard reported OK.
const scriptProbe = path.join(ROOT, "scripts", "__encoding-probe.mjs");
const PROBES = [probe, scriptProbe];
const cleanup = () => {
  for (const p of PROBES) {
    try {
      if (fs.existsSync(p)) fs.unlinkSync(p);
    } catch {
      /* best effort */
    }
  }
};
process.on("exit", cleanup);
process.on("uncaughtException", (e) => {
  cleanup();
  throw e;
});
const results = [];

function control(name, bytes, expectFail, target = probe) {
  cleanup();
  fs.writeFileSync(target, bytes);
  let r;
  try {
    r = run(ROOT);
  } finally {
    cleanup();
  }
  const failed = r.code !== 0;
  const ok = failed === expectFail;
  results.push({ name, expectFail, failed, ok, out: r.out.trim().split("\n").slice(-1)[0] || "" });
}

const enc = (s) => Buffer.from(s, "utf8");

// --- must fail -------------------------------------------------------------
control(
  "BOM at the start of the file",
  Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), enc("# Title\n\nSome text.\n")]),
  true,
);
control(
  "C1 control character (U+009D) — the shape that defeated a signature scan",
  enc("# Title\n\nmangled \u00e2\u20ac\u009d here\n"),
  true,
);
control("U+FFFD replacement character — a byte was already lost", enc("# Title\n\nlost \ufffd here\n"), true);
control("Invalid UTF-8 byte sequence", Buffer.from([0x23, 0x20, 0xff, 0xfe, 0x0a]), true);

// THE REAL DEFECT, verbatim from the committed docs/SESSION-LOG.md.
//
// This control exists because the guard MISSED it twice. An em-dash stored as
// U+00E2 U+20AC U+201D is valid UTF-8 with no BOM and no C1 control, so all
// three structural checks passed it. The mojibake list was then added and STILL
// missed it, because I wrote the character class with \u2122 where \u201d was
// meant -- a typo that makes the regex silently never match. **A wrong
// character class fails in the direction of silence**, so the only defence is a
// control that re-plants the exact bytes.
control(
  "the real defect: em-dash as U+00E2 U+20AC U+201D",
  enc("# Title\n\nmangled every typographic character \u00e2\u20ac\u201d here\n"),
  true,
);
control(
  "curly double quote round-tripped",
  enc("# Title\n\n\u00e2\u20ac\u009d quoted\n"),
  true,
);
control(
  "accented character round-tripped",
  enc("# Title\n\ncaf\u00c3\u00a9 here\n"),
  true,
);

// --- must pass -------------------------------------------------------------
control("Clean UTF-8 with real typographic characters", enc("# Title\n\nAn em-dash — and curly “quotes”.\n"), false);
control("Clean UTF-8 with box drawing and arrows", enc("├── phase one\n└── phase two ▶\n"), false);
control("Command syntax with a spaced double hyphen", enc("Run `git checkout -- path` here.\n"), false);
// The corpus deliberately QUOTES mojibake when documenting the bug. Flagging
// that would mean the guard complains about the very file warning readers.
control("Mojibake quoted inside a code span — must pass", enc("# Title\n\nThe bytes were `\u00e2\u20ac\u201d` in the file.\n"), false);
control("Empty file", Buffer.alloc(0), false);

// --- the scope the guard used to miss --------------------------------------
//
// These exercise the .mjs scan added after split-claims.mjs was found carrying eleven
// corrupted lines while the guard reported ENCODING OK. Without them the widened scope
// is a claim in a comment: nothing would fail if someone narrowed the extension list
// back again, and a corrupted script is worse than a corrupted document because it
// GENERATES documents.
control(
  "Mojibake inside a SCRIPT, not a document (must fail)",
  enc("// 25% \u00c2\u00b1 1 would fail honest quizzes.\nexport const x = 1;\n"),
  true,
  scriptProbe,
);
control(
  "Em-dash mojibake inside a SCRIPT          (must fail)",
  enc("// a comment with \u00e2\u20ac\u201d an em dash gone wrong\nexport const y = 2;\n"),
  true,
  scriptProbe,
);
control(
  "Clean script with real typography        (must pass)",
  enc("// 25% \u00b1 1 — an em dash and a plus-minus\nexport const z = 3;\n"),
  false,
  scriptProbe,
);

console.log("");
console.log("Encoding-guard controls");
console.log("=".repeat(64));
for (const r of results) {
  const want = r.expectFail ? "must fail" : "must pass";
  console.log(`  ${r.ok ? "PASS" : "FAIL"}  ${r.name.padEnd(52)} (${want})`);
}
const bad = results.filter((r) => !r.ok);
console.log("");
if (bad.length) {
  console.log(`${bad.length} control(s) failed — the guard does not behave as documented.`);
  for (const b of bad) console.log(`  ${b.name}: ${b.out}`);
  process.exit(1);
}
console.log(`All ${results.length} controls behaved as documented: the guard can fail, and does not cry wolf.`);
console.log("");

fs.rmSync(tmp, { recursive: true, force: true });
