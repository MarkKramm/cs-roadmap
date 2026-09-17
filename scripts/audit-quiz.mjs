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
// A THIRD CLASS WAS ADDED ON 2026-09-17, ONE LEVEL ABOVE BOTH OF THEM.
// Classes 1 and 2 are per-phase, and a corpus can be badly skewed while every
// phase passes. It happened: when the IT on-ramp was written as a batch of
// seven quizzes, every phase balanced individually and the corpus still drifted
// to A=17.2% against C=35.2%, with three phases sitting exactly on the 50% line.
// A reader working the track in order sees the pattern across phases, which no
// per-quiz check can observe. The corpus distribution was printed on every run
// and never gated — and it drifted in the documentation anyway, quoted as
// A=90 B=97 C=97 D=96 in one file while the guard printed C=98 D=97.
//
// Class 3 gates the corpus spread. The threshold is deliberately loose: an
// even split is not the goal, only that no single position has become the
// answer a guesser would learn to pick. See CORPUS_* below.
//
// The balance threshold is 50% rather than an even split, deliberately. With 10
// questions and 4 positions a perfectly even split is impossible, and forcing
// 25% Â± 1 would fail honest quizzes for arithmetic reasons. 50% is the point
// where guessing one letter beats reading, which is the property worth gating.
//
// Read-only: writes nothing.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'career-roadmaps';
const TRACKS = ['it-roadmap', 'cybersec-roadmap', 'advance-roadmap'];

// Class 3 — corpus-level spread. The per-phase rule catches a quiz where a
// guesser beats a reader *within one sitting*. The corpus rule catches the same
// advantage accumulated across a whole track, which is what a reader working
// the phases in order actually experiences.
//
// The band is wide on purpose. A 4-position corpus of ~380 questions averages
// 25% each, and honest authoring will not land on 25.0 exactly. 35% is the
// point at which one letter has become a strategy worth learning; 15% catches
// the mirror failure, a position that has been effectively abandoned so a
// reader who has learned to ignore it is being helped rather than tested.
// Both bounds are named here rather than inlined, so the failure message and
// the check cannot drift apart.
const CORPUS_MAX_SHARE = 0.35;
const CORPUS_MIN_SHARE = 0.15;

const findings = [];
const note = (file, line, message) => findings.push({ file, line, message });

// How many questions offer each option count, corpus-wide. Class 3 needs this to
// know which positions the corpus is *supposed* to be using — see the floor below.
const optionShapes = new Map();

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
    optionShapes.set(q.options, (optionShapes.get(q.options) ?? 0) + 1);
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

// Class 3 — the corpus distribution, checked AFTER every phase has contributed
// to `globalPositions`. Anything that must hold across the whole collection has
// to run once the collection is complete, which is why this sits here and not
// inside the per-file loop above.
//
// Reported through the same `findings` array as the other two classes so it
// gates identically; the pseudo-file names the whole corpus rather than a phase.
const corpusPositions = Object.keys(globalPositions).map(Number).sort((a, b) => a - b);
const corpusTotal = corpusPositions.reduce((n, p) => n + globalPositions[p], 0);
if (corpusTotal > 0) {
  const shares = corpusPositions.map((p) => ({ pos: p, n: globalPositions[p], share: globalPositions[p] / corpusTotal }));
  for (const s of shares) {
    if (s.share > CORPUS_MAX_SHARE) {
      note(
        '(corpus)',
        0,
        `across all ${corpusTotal} questions, position ${LETTER(s.pos)} holds ${s.n} answers ` +
          `(${Math.round(s.share * 100)}%) — above the ${Math.round(CORPUS_MAX_SHARE * 100)}% ceiling, ` +
          `so a reader who works the track in order can learn to favour one letter`,
      );
    }
  }
  // The floor applies to positions the corpus genuinely uses, which is the
  // widest shape offered by *more than a token number* of questions.
  //
  // The first version read `usedCount >= 4` — the number of non-empty positions
  // — which made the floor unreachable in precisely the case it exists for: a
  // position with no answers is not "in use", so abandoning one lowered the
  // count and switched the check off. Abandoning a position was the one way to
  // guarantee the rule could not see it. Caught by a control that moved all 97
  // D-answers to A/B/C: 32 per-phase findings fired, the corpus exit code was 1,
  // and the floor branch never ran, so the gate looked like it worked while the
  // new rule had never executed once.
  //
  // The second version derived the expectation from the widest question shape
  // and was too strict the other way: the corpus contains exactly ONE
  // five-option question (advance-07-q04), so it demanded an answer in E out of
  // 382 questions and failed the real corpus. A single question offering a
  // fifth slot does not make E a position the corpus uses; it means E has
  // almost no opportunity to be chosen. Requiring an answer there would be the
  // guard inventing a defect, which is the failure this file already warns
  // about one level down.
  //
  // So a shape must be offered by a meaningful share of questions before its
  // positions are required to carry answers. A position counts as available
  // only if at least 5% of questions offer it — comfortably above a single
  // outlier, comfortably below any real four- or five-option quiz.
  const minOffered = Math.max(4, Math.ceil(corpusTotal * 0.05));
  const opportunity = new Map();
  // Iterate the Map's ENTRIES. The first version wrote `for (const shape of
  // optionShapes)` and then read `shape.options`, which is undefined on a
  // [key, value] pair — so the loop contributed nothing, `opportunity` stayed
  // empty, and the floor silently never ran. That is why the control above kept
  // failing while the guard still exited 1 for an unrelated per-phase reason:
  // the gate was green-looking and the new branch was dead on arrival. A Map is
  // not an array, and `for…of` does not say which one you meant.
  for (const [options, count] of optionShapes) {
    for (let p = 0; p < options; p++) opportunity.set(p, (opportunity.get(p) ?? 0) + count);
  }
  for (const [p, offered] of [...opportunity.entries()].sort((a, b) => a[0] - b[0])) {
    if (offered < minOffered) continue;
    const s = shares.find((x) => x.pos === p);
    if (!s) {
      note(
        '(corpus)',
        0,
        `across all ${corpusTotal} questions, position ${LETTER(p)} holds no answers at all — ` +
          `${offered} questions offer it, so it is effectively abandoned and a reader who ` +
          `stops considering it is being helped`,
      );
    } else if (s.share < CORPUS_MIN_SHARE) {
      note(
        '(corpus)',
        0,
        `across all ${corpusTotal} questions, position ${LETTER(s.pos)} holds only ${s.n} answers ` +
          `(${Math.round(s.share * 100)}%) — below the ${Math.round(CORPUS_MIN_SHARE * 100)}% floor; ` +
          `an effectively abandoned position is an advantage to a reader who has noticed`,
      );
    }
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
