// Quiz audit. Exit code 1 on a structural defect, so it can gate CI.
//
// WHY THIS EXISTS
// `build-content.mjs` already fails the build on a malformed quiz — no marked
// answer, two marked answers, a missing explanation, a duplicate id. Those are
// per-question defects, and they are caught where the question is parsed.
//
// What the build CANNOT see is a defect of the SET. The first quiz written for
// this repository (it-02, ten questions) put seven of its ten correct answers in
// position C. Every question was individually valid, the build was green, and
// the quiz was still broken: a reader who answers "C" every time scores 70%
// without reading the questions. That is a property of the collection rather
// than of any question in it, so it needs a check that sees the whole set —
// which is exactly the shape of defect this repository has repeatedly found
// only by reading output rather than by trusting a green build.
//
// Two classes are checked, both properties of the set:
//
//   1. Correct-answer position balance. Measured across a phase's questions, no
//      single position may hold more than 50% of the answers, and every position
//      must be used at least once once a phase has 4 or more questions.
//   2. Option-count consistency. A quiz whose questions alternate between 3 and
//      5 options is harder to read than one that keeps a shape, and a question
//      with 2 options is a coin flip rather than a test.
//
// The balance threshold is 50% rather than an even split, deliberately. With 10
// questions and 4 positions a perfectly even split is impossible, and forcing
// 25% ± 1 would fail honest quizzes for arithmetic reasons. 50% is the point
// where guessing one letter beats reading, which is the property worth gating.
//
// Read-only: writes nothing.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'career-roadmaps';
const TRACKS = ['it-roadmap', 'cybersec-roadmap', 'advance-roadmap'];

const findings = [];
const note = (file, line, message) => findings.push({ file, line, message });

const LETTER = (i) => String.fromCharCode(65 + i);

// Parse one phase file's `## Quiz` section. Kept self-contained rather than
// importing from build-content.mjs, which is a script with top-level side
// effects and would build the whole site when imported.
function parseQuiz(text) {
  const lines = text.split('\n');
  let inQuiz = false;
  const questions = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const h2 = line.match(/^##\s+(.+?)\s*$/);
    if (h2) {
      inQuiz = h2[1].trim() === 'Quiz';
      continue;
    }
    if (!inQuiz) continue;

    const h3 = line.match(/^###\s+(.*)$/);
    if (h3) {
      const idm = h3[1].match(/<!--\s*id:\s*([^\s]+)/);
      questions.push({ id: idm ? idm[1] : '(no id)', line: i + 1, answer: -1, options: 0, why: false });
      continue;
    }
    if (questions.length === 0) continue;
    const q = questions[questions.length - 1];

    const opt = line.match(/^-\s+\[([ xX])\]\s+(.*)$/);
    if (opt) {
      if (opt[1].toLowerCase() === 'x') q.answer = q.options;
      q.options++;
      continue;
    }
    if (/^\*\*Why:\*\*/.test(line)) q.why = true;
  }
  return questions;
}

const files = [];
for (const track of TRACKS) {
  const dir = path.join(ROOT, track);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) {
    if (/-phase-[a-z0-9-]+\.md$/.test(f)) files.push(path.join(dir, f));
  }
}
files.sort();

let phasesWithQuiz = 0;
let totalQuestions = 0;
const globalPositions = {};

for (const full of files) {
  const rel = path.relative(ROOT, full).replace(/\\/g, '/');
  const questions = parseQuiz(fs.readFileSync(full, 'utf8'));
  if (questions.length === 0) continue;
  phasesWithQuiz++;
  totalQuestions += questions.length;

  for (const q of questions) {
    // Class 2 — option-count consistency, per question.
    if (q.options < 3) {
      note(rel, q.line, `${q.id} has ${q.options} option(s) — fewer than 3 makes it a coin flip`);
    }
    if (q.answer < 0) {
      note(rel, q.line, `${q.id} has no correct option marked with [x]`);
    }
  }

  // Class 1 — position balance, as a property of the phase's set.
  const counts = new Map();
  for (const q of questions) {
    if (q.answer < 0) continue;
    counts.set(q.answer, (counts.get(q.answer) ?? 0) + 1);
    globalPositions[q.answer] = (globalPositions[q.answer] ?? 0) + 1;
  }
  const usable = questions.length;
  for (const [pos, n] of counts) {
    if (usable >= 4 && n / usable > 0.5) {
      note(
        rel,
        questions[0].line,
        `correct answers are skewed: ${n} of ${usable} sit in position ${LETTER(pos)} ` +
          `(${Math.round((n / usable) * 100)}%) — guessing that letter beats reading`,
      );
    }
  }
  if (usable >= 4) {
    // "Every position used" is only meaningful up to the SMALLEST option count,
    // because a position that exists only in the 5-option questions is not
    // available to the 4-option ones. Comparing against the maximum made a
    // healthy quiz report "no answer sits in position E" purely because most of
    // its questions had four options — the guard inventing a defect, which is
    // the same failure it exists to catch, one level up.
    const minPos = Math.min(...questions.map((q) => q.options)) - 1;
    const used = new Set([...counts.keys()]);
    const unused = [];
    for (let p = 0; p <= minPos; p++) if (!used.has(p)) unused.push(LETTER(p));
    if (unused.length) {
      note(rel, questions[0].line, `no correct answer sits in position ${unused.join(' or ')} across ${usable} question(s)`);
    }
  }

  // Option-count spread is reported only when it is genuinely erratic. A quiz
  // that mixes four- and five-option questions is fine — some questions have a
  // fourth plausible distractor and others do not, and forcing them to match
  // would mean padding a question with filler, which is worse than a ragged
  // shape. Three or more distinct counts, or a range wider than one, means the
  // quiz was not authored to a consistent standard.
  const sizes = [...new Set(questions.map((q) => q.options))].sort((a, b) => a - b);
  if (sizes.length > 2 || (sizes.length === 2 && sizes[1] - sizes[0] > 1)) {
    note(
      rel,
      questions[0].line,
      `questions vary in option count (${sizes.join(', ')}) — ` +
        `one consistent shape per quiz reads better`,
    );
  }
}

// Report.
findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
for (const f of findings) console.log(`${f.file}:${f.line}: ${f.message}`);
console.log('');
console.log(`phases with a quiz: ${phasesWithQuiz} of ${files.length}`);
console.log(`questions checked: ${totalQuestions}`);
const dist = Object.keys(globalPositions)
  .sort((a, b) => a - b)
  .map((k) => `${LETTER(Number(k))}=${globalPositions[k]}`)
  .join(' ');
if (dist) console.log(`answer position across the whole corpus: ${dist}`);
console.log(`findings: ${findings.length}`);
if (findings.length === 0) {
  console.log('Quiz sets are sound: answers balanced across positions, consistent option counts.');
}
process.exit(findings.length === 0 ? 0 : 1);
