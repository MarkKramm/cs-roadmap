// Does any QUIZ answer key depend on an OWASP Top 10 category NUMBER?
//
// The 2021->2025 renumbering moved six of ten categories. If a quiz asks a
// question whose correct answer is a number, that answer may now be stale --
// and a stale answer key is worse than a stale lesson, because a learner is
// told they are WRONG for being right.
//
// The naive approach (search the text after "## Quiz") gave two false
// positives: a Checklist section that follows the quiz, and "A10" matching
// inside a networking question about port 445. So this parses actual question
// blocks and only looks at the question, its options, and its Why line.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

// An OWASP category NUMBER asserted as an answer. "A10" alone is not enough --
// it collides with networking and with "A10" in prose. Require the shape of a
// category reference: A0n or A10 bound to a category concept.
const CATEGORY_WORDS =
  /broken access|access control|cryptographic|misconfigur|insecure design|injection|vulnerable and outdated|outdated component|identification and authentication|authentication failure|integrity failure|logging and monitoring|logging and alerting|supply chain|server-side request|ssrf|exceptional condition/i;
const NUMBERED = /\bA(?:0[1-9]|10)\b/;

function quizzes() {
  const out = [];
  for (const track of ["cybersec-roadmap", "it-roadmap", "advance-roadmap"]) {
    const dir = path.join(ROOT, "career-roadmaps", track);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith(".md")) continue;
      out.push(path.join(dir, f));
    }
  }
  return out;
}

const findings = [];
let questions = 0;
let quizFiles = 0;

for (const file of quizzes()) {
  const rel = path.relative(ROOT, file);
  const text = fs.readFileSync(file, "utf8");
  const start = text.indexOf("\n## Quiz");
  if (start < 0) continue;
  quizFiles++;

  // A quiz ends at the next top-level heading.
  let body = text.slice(start + 1);
  const next = body.slice(5).search(/\n## /);
  if (next >= 0) body = body.slice(0, next + 5);

  // Split into question blocks.
  const blocks = body.split(/(?=^### Q\d+\.)/m).filter((b) => /^### Q\d+\./.test(b));
  for (const b of blocks) {
    questions++;
    // Only the QUESTION and its OPTIONS are the answer key. The `**Why:**`
    // explanation is prose that may legitimately DISCUSS a category -- "A10 is
    // not a category reference here" is a sentence about a wrong reading, not
    // an answer. Searching the whole block flagged exactly that, caught by the
    // port-445 control. A guard that flags a correct explanation teaches people
    // to ignore it.
    const key = b.split(/\n\*\*Why:/)[0];
    const hasNumber = NUMBERED.test(key);
    const hasWord = CATEGORY_WORDS.test(key);
    if (hasNumber && hasWord) {
      findings.push({
        file: rel,
        q: (b.match(/^### (Q\d+)\./) || [])[1],
        text: b.split("\n").find((l) => l.startsWith("### ")).slice(4, 120),
      });
    }
  }
}

console.log("");
console.log(`scanned ${questions} questions across ${quizFiles} quizzes`);
console.log("");
if (findings.length) {
  console.log(`OWASP NUMBER + CATEGORY IN AN ANSWER -- ${findings.length} question(s) to read:`);
  console.log("");
  for (const f of findings) {
    console.log(`  ${f.file} ${f.q}`);
    console.log(`    ${f.text}`);
    console.log("");
  }
  // Without this the guard PRINTS the finding and exits 0, so CI goes green on
  // a defect. The control suite caught exactly that: three "must fail" cases
  // reported FAIL because the child process returned success while its stdout
  // contained the finding. A guard that detects and does not fail is worse than
  // no guard, because it looks like coverage.
  process.exit(1);
} else {
  console.log("No quiz question binds an OWASP category NUMBER to a category name.");
  console.log("The 2021->2025 renumbering therefore cannot have staled an answer key:");
  console.log("a quiz can only be wrong about this if it names a number, and none do.");
}
console.log("");
