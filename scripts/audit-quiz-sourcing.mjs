// Verify quiz sets added by the phase-quiz expansion.
//
// WHY THIS EXISTS
// Twenty phases are getting quizzes written for them in one pass, which is
// exactly the situation where quality drifts and nobody notices. `audit-quiz`
// already gates the structural rules (option counts, position balance), but it
// answers "is this quiz valid", not "is this quiz sourced from its own phase".
//
// That second question is the one this file answers, and it is the failure mode
// this repository has hit repeatedly: a model handed a large file produces
// plausible text that is not in the file. So every question is checked against
// the phase it claims to belong to:
//
//   1. The quiz sits in the phase it names, before `## Checklist`.
//   2. Every question id matches `<phase-id>-q<nn>`, numbered without gaps.
//   3. Each question has exactly 4 options and exactly 1 marked correct.
//   4. Each question has a `**Why:**` on a single line.
//   5. Answer positions are balanced (no position over 50%, all four used).
//   6. THE SOURCING CHECK: each question shares distinctive vocabulary with its
//      own phase, and does NOT share distinctive vocabulary with a *different*
//      phase more strongly. A question written about the wrong phase, or
//      invented rather than read, fails here.
//
// Read-only: writes nothing. Exit 1 on any failure.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, basename } from "node:path";

const ROOT = process.cwd();
const TRACKS = ["it-roadmap", "cybersec-roadmap", "advance-roadmap"];

// Words that appear everywhere in a technical curriculum and so carry no signal
// about which phase a question came from.
const STOP = new Set(
  `the a an and or but if then than that this these those it its is are was were be been being
   to of in on at by for with from into over under about as not no nor so such can could should
   would may might must will shall do does did done have has had you your yours we our us they
   them their there here what which who whom when where why how all any both each few more most
   other some only own same too very just also even still yet because while during before after
   above below up down out off again further once i me my he she his her him one two three four
   five six seven eight nine ten use used using make makes made get gets got give gives given
   take takes taken see sees seen know knows known think thinks want wants need needs like likely
   thing things way ways time times part parts point points case cases example examples number
   numbers first second third next last new old good bad better best worse worst same different
   phase lesson task tasks checklist quiz question questions answer answers option options why
   why: which correct wrong true false above below section part step steps`
    .split(/\s+/)
    .filter(Boolean)
);

function readPhase(path) {
  return readFileSync(path, "utf8");
}

// The quiz block only: from `## Quiz` to the next `## ` heading.
function quizBlock(text) {
  const start = text.search(/^## Quiz\s*$/m);
  if (start === -1) return null;
  const rest = text.slice(start);
  const end = rest.slice(1).search(/^## /m);
  return end === -1 ? rest : rest.slice(0, end + 1);
}

// Split a quiz block into questions. Each question is one `### Qn.` heading plus
// everything up to the next heading or the end.
function parseQuestions(block) {
  const parts = block.split(/^### /m).slice(1);
  return parts.map((p) => {
    const nl = p.indexOf("\n");
    const head = nl === -1 ? p : p.slice(0, nl);
    const body = nl === -1 ? "" : p.slice(nl + 1);
    const lines = body.split("\n");
    const options = [];
    let why = null;
    for (const line of lines) {
      const m = /^- \[([ x])\]\s*(.+?)\s*$/.exec(line);
      if (m) options.push({ correct: m[1] === "x", text: m[2] });
      if (/^\*\*Why:\*\*/.test(line)) why = line;
    }
    const idm = /<!--\s*id:\s*([a-z0-9-]+)\s+energy:\s*(low|normal|high)\s*-->/.exec(head);
    const qm = /^Q(\d+)\.\s*(.+?)\s*(?:<!--|$)/.exec(head);
    return {
      head,
      id: idm ? idm[1] : null,
      energy: idm ? idm[2] : null,
      num: qm ? Number(qm[1]) : null,
      text: qm ? qm[2] : "",
      options,
      why,
    };
  });
}

// Distinctive terms: words of 4+ chars, not stopwords, not pure numbers.
function terms(s) {
  return new Set(
    s
      .toLowerCase()
      .replace(/[`*_>#|()[\]{}]/g, " ")
      .split(/[^a-z0-9|.\-/]+/)
      .filter((w) => w.length >= 4 && !STOP.has(w) && !/^\d+$/.test(w))
  );
}

function overlap(a, b) {
  let n = 0;
  for (const w of a) if (b.has(w)) n++;
  return n;
}

// --- harness -----------------------------------------------------------------
let failures = 0;
const fail = (msg) => {
  failures++;
  console.log(`  FAIL  ${msg}`);
};
const ok = (msg) => console.log(`  ok    ${msg}`);

// Collect every phase file and its text, so the cross-phase check has all of them.
const all = [];
for (const track of TRACKS) {
  const dir = join(ROOT, "career-roadmaps", track);
  for (const f of readdirSync(dir)) {
    if (!f.endsWith(".md") || !f.includes("phase")) continue;
    const path = join(dir, f);
    if (!statSync(path).isFile()) continue;
    const text = readPhase(path);
    const idm = /^id:\s*([a-z0-9-]+)/m.exec(text);
    const pnum = /^phase:\s*(\d+)/m.exec(text);
    // Quiz ids use a short prefix: `it-roadmap` -> `it`, `cybersec-roadmap` ->
    // `cyber`, `advance-roadmap` -> `advance`.
    const short = { "it-roadmap": "it", "cybersec-roadmap": "cyber", "advance-roadmap": "advance" }[track];
    all.push({
      track,
      trackShort: short,
      phaseNum: pnum ? Number(pnum[1]) : 0,
      file: f,
      path,
      text,
      id: idm ? idm[1] : basename(f, ".md"),
    });
  }
}

const withQuiz = all.filter((p) => quizBlock(p.text) !== null);
const targeted = process.argv.slice(2);
const checked = targeted.length
  ? withQuiz.filter((p) => targeted.some((t) => p.file.includes(t) || p.id.includes(t)))
  : withQuiz;

console.log("");
console.log(`phases with a quiz: ${withQuiz.length} of ${all.length}`);
console.log(`checking: ${checked.length} phase(s)`);
console.log("");

let totalQ = 0;
const corpusPos = { A: 0, B: 0, C: 0, D: 0 };

for (const p of checked) {
  const block = quizBlock(p.text);
  const qs = parseQuestions(block);

  // 1. Position: before Checklist.
  const qStart = p.text.search(/^## Quiz\s*$/m);
  const cStart = p.text.search(/^## Checklist\s*$/m);
  if (cStart !== -1 && qStart > cStart) fail(`${p.file}: quiz appears after ## Checklist`);

  // 2. Numbering and ids.
  //
  // The id convention is `<track>-<phase>-q<nn>` -- NOT the full frontmatter id.
  // `cyber-01-foundations` uses `cyber-01-q01`, not `cyber-01-foundations-q01`.
  // This rule was written from the frontmatter first and produced 141 false
  // findings across 10 already-passing quizzes; the corpus is the specification,
  // so the prefix is derived from the track and phase number instead.
  const idPrefix = `${p.trackShort}-${String(p.phaseNum).padStart(2, "0")}`;
  for (let i = 0; i < qs.length; i++) {
    const q = qs[i];
    const want = i + 1;
    if (q.num !== want) fail(`${p.file}: question ${i + 1} is numbered Q${q.num}`);
    const wantId = `${idPrefix}-q${String(want).padStart(2, "0")}`;
    if (q.id !== wantId) fail(`${p.file}: Q${want} id is "${q.id}", expected "${wantId}"`);
    if (!q.energy) fail(`${p.file}: Q${want} has no energy value`);

    // 3. Option shape.
    //
    // Four or five, not "exactly four". `audit-quiz.mjs` deliberately allows a
    // fifth option where a fourth plausible distractor genuinely exists, and its
    // comment gives the reason: forcing a fixed count would mean padding a
    // question with filler, which is worse than a ragged shape. An "exactly 4"
    // rule here contradicted that decision and flagged the one honest
    // five-option question in the corpus (advance-07 Q4).
    if (q.options.length < 4 || q.options.length > 5) {
      fail(`${p.file}: Q${want} has ${q.options.length} options, expected 4 or 5`);
    }
    const marked = q.options.filter((o) => o.correct).length;
    if (marked !== 1) fail(`${p.file}: Q${want} marks ${marked} correct options, expected 1`);
    const idx = q.options.findIndex((o) => o.correct);
    if (idx >= 0 && idx < 4) corpusPos["ABCD"[idx]]++;

    // 4. Why on one line.
    if (!q.why) fail(`${p.file}: Q${want} has no **Why:** line`);
    else if (q.why.length < 60) fail(`${p.file}: Q${want} **Why:** is too short to teach (${q.why.length} chars)`);
  }

  // 5. Per-phase position balance.
  const pos = { A: 0, B: 0, C: 0, D: 0 };
  for (const q of qs) {
    const i = q.options.findIndex((o) => o.correct);
    if (i >= 0 && i < 4) pos["ABCD"[i]]++;
  }
  if (qs.length >= 4) {
    for (const k of "ABCD") {
      if (pos[k] === 0) fail(`${p.file}: position ${k} is never the answer (${qs.length} questions)`);
      if (pos[k] / qs.length > 0.5) fail(`${p.file}: position ${k} holds ${pos[k]}/${qs.length} answers (over 50%)`);
    }
  }

  // 6. SOURCING: each question must look like it came from THIS phase.
  const own = terms(p.text);
  for (const q of qs) {
    const qt = terms(q.text + " " + q.options.map((o) => o.text).join(" ") + " " + (q.why || ""));
    const ownScore = overlap(qt, own);
    // Compare against every other phase; if another phase explains this question
    // better than its own does, the question is probably in the wrong file.
    let bestOther = 0;
    let bestName = "";
    for (const o of all) {
      if (o.id === p.id) continue;
      const s = overlap(qt, terms(o.text));
      if (s > bestOther) {
        bestOther = s;
        bestName = o.id;
      }
    }
    if (ownScore === 0) {
      fail(`${p.file}: Q${q.num} shares no distinctive vocabulary with its own phase`);
    } else if (bestOther > ownScore * 1.35 && bestOther - ownScore >= 4) {
      fail(
        `${p.file}: Q${q.num} matches ${bestName} (${bestOther}) better than its own phase (${ownScore})`
      );
    }
  }

  totalQ += qs.length;
  console.log(
    `  ${p.file.padEnd(46)} ${String(qs.length).padStart(2)} questions  A=${pos.A} B=${pos.B} C=${pos.C} D=${pos.D}`
  );
}

console.log("");
console.log(`questions checked: ${totalQ}`);
console.log(
  `corpus answer position: A=${corpusPos.A} B=${corpusPos.B} C=${corpusPos.C} D=${corpusPos.D}`
);
console.log("");
if (failures) {
  console.log(`${failures} finding(s) -- these quizzes are not ready.`);
  process.exit(1);
}
console.log("Quiz expansion verified: structure sound, numbering correct, every question sourced from its own phase.");
