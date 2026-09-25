// Build-time content pipeline (M1 step 2c).
// Reads career-roadmaps/**/NN-phase-*.md plus standalone shared/exam papers and emits
// learning-site/src/data/generated/{it,cyber,advance}.json, search/shared/exams data.
// Contract: docs/CONTENT-SCHEMA.md. Zero dependencies, fails loudly.

import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from "node:fs";
import { join, relative, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { parseLesson } from "./lesson-ast.mjs";
import { buildSearchIndex } from "./search-index.mjs";
import { buildShared } from "./shared-content.mjs";
import { buildExams } from "./exam-content.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = join(ROOT, "career-roadmaps");
const OUT = join(ROOT, "learning-site", "src", "data", "generated");

const MANDATORY = [
  "Goal of this phase",
  "Estimated time",
  "Skills you'll gain",
  "Tools for This Phase",
  "Free/cheap resources",
  "Hands-on practice tasks",
  "Deliverable / proof of work",
  "Checklist",
  "You're ready to move on when...",
  "Free vs Paid",
];

// The lesson region is where the teaching actually happens: measured across
// both tracks it is 84–95% of every phase file. `sections()` below only splits
// on `##`, so the whole `Lesson` section is captured as one blob and parsed
// separately into blocks by lesson-ast.mjs. See docs/CONTENT-SCHEMA.md.
const LESSON = "Lesson";

const OPTIONAL = [
  "Specific topics to learn",
  "Quiz",
  "Lab setup options",
  "Path options",
  "Required projects",
  "Recommended order",
  "Target roles",
];

const errors = [];
const fail = (file, msg) => errors.push(file + ": " + msg);

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const f = join(dir, e);
    if (statSync(f).isDirectory()) out.push(...walk(f));
    else out.push(f);
  }
  return out;
}

function parseFrontMatter(text, file) {
  if (!text.startsWith("---\n")) {
    fail(file, "missing front-matter");
    return { data: null, body: text };
  }
  const end = text.indexOf("\n---\n", 3);
  if (end === -1) {
    fail(file, "unterminated front-matter");
    return { data: null, body: text };
  }
  const data = {};
  for (const line of text.slice(4, end).split("\n")) {
    const m = line.match(/^([a-z_]+):\s*(.*)$/);
    if (!m) continue;
    const v = m[2].trim();
    if (v.startsWith("[") && v.endsWith("]")) {
      data[m[1]] = v.slice(1, -1).split(",").map((s) => s.trim()).filter(Boolean);
    } else if (v.startsWith('"') && v.endsWith('"')) {
      data[m[1]] = v.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
    } else if (/^-?\d+$/.test(v)) {
      data[m[1]] = Number(v);
    } else if (v === "null") {
      data[m[1]] = null;
    } else {
      data[m[1]] = v;
    }
  }
  return { data, body: text.slice(end + 5) };
}

// Fenced code blocks may legitimately contain lines that look like headings —
// a Markdown report template inside a ```text fence, for example. Heading
// detection therefore has to track fence state, or those lines are read as
// real sections. See docs/CONTENT-GUIDE.md ("Fenced code blocks").
function fenceTracker() {
  let marker = null;
  return (line) => {
    const m = line.match(/^\s*(`{3,}|~{3,})/);
    if (!m) return marker !== null;
    const ch = m[1][0];
    if (marker === null) marker = ch;
    else if (marker === ch) marker = null;
    return true;
  };
}

function sections(body) {
  const map = {};
  let current = null;
  const inFence = fenceTracker();
  for (const line of body.split("\n")) {
    if (inFence(line)) {
      if (current) map[current].push(line);
      continue;
    }
    const h2 = line.match(/^## (.+)$/);
    if (h2) {
      current = h2[1].trim();
      map[current] = [];
      continue;
    }
    if (current) map[current].push(line);
  }
  return map;
}

function subsections(lines) {
  const map = {};
  let current = null;
  const inFence = fenceTracker();
  for (const line of lines) {
    if (inFence(line)) {
      if (current) map[current].push(line);
      continue;
    }
    const h3 = line.match(/^### (.+)$/);
    if (h3) {
      current = h3[1].trim();
      map[current] = [];
      continue;
    }
    if (current) map[current].push(line);
  }
  return map;
}

const bullets = (lines) =>
  lines.filter((l) => /^[-*]\s+/.test(l)).map((l) => l.replace(/^[-*]\s+/, "").trim());

const numbered = (lines) =>
  lines.filter((l) => /^\d+\.\s+/.test(l)).map((l) => l.replace(/^\d+\.\s+/, "").trim());

// Practice tasks, each with a stable id.
//
// WHY TASKS NEED IDS TOO
// Checklist items carry an authored `<!-- id: … -->`, so progress survives a
// reworded task. Practice tasks had no id at all, and the reader's *answer* to a
// task is about to be stored — keying it by array index would silently move one
// reader's answer onto a different question the moment a task is inserted above
// it. Silent mis-attribution is the failure this repository has already been
// bitten by twice (D-013), so tasks get ids on the same principle as the
// checklist.
//
// HONEST LIMITATION: these ids are minted from position at build time, not
// authored in the Markdown. Inserting a task in the MIDDLE of a list therefore
// renumbers the ones after it, and answers keyed to the old numbers would follow
// the position rather than the question. Appending is safe; reordering is not.
// Migrating to authored `<!-- id: -->` comments on task lines would remove this
// caveat and is a one-line change here when wanted — the curriculum's task lists
// have only ever grown, which is why it has not been needed yet.
// A task's authored comment: `<!-- id: cyber-04-t07 band: deep energy: high -->`.
// Both extra fields are optional, so a task can be given a stable id before
// anyone has judged how long it takes or how hard it is. The order is fixed
// (id, band, energy) and the parser is deliberately not order-tolerant: one
// accepted spelling is easier to lint than several, and the migration is
// mechanical anyway.
const TASK_COMMENT =
  /<!--\s*id:\s*([^\s>]+)(?:\s+band:\s*([a-z]+))?(?:\s+energy:\s*([a-z]+))?\s*-->/;

// The energy values, matching the checklist's own vocabulary. Validated here
// rather than trusted, because a typo would otherwise reach the picker as an
// unknown string and silently behave like "normal".
const ENERGIES = ["low", "normal", "high"];

// The four bands. `ongoing` is not a duration — it marks a task that is not a
// single timed sitting at all: a recurring weekly commitment, one gated on real
// time passing, one that must span several sessions, or one that is
// hardware-gated and may be impossible on the reader's machine. A time-aware
// picker must exclude these rather than offer "30 minutes: apply to 5 roles".
// See docs/DECISIONS.md → D-021.
const BANDS = ["quick", "focused", "deep", "ongoing"];

// Coverage counters, reported at the end. They exist because a half-migrated
// corpus is the honest state during this change, and a summary line that says
// "authored 70, minted 182" is a fact the next person needs — a build that
// silently mints an id for a task nobody banded looks identical to one where
// every task was banded.
let authoredTaskCount = 0;
let mintedTaskCount = 0;
let bandedTaskCount = 0;
let energisedTaskCount = 0;

/**
 * Practice tasks, with an id and a band.
 *
 * IDs are AUTHORED now, not minted. The previous version minted `<phase>-tNN`
 * from array position, which made appending safe and reordering silently wrong —
 * a reader's answer keyed to `t03` would follow the position rather than the
 * question, and reappear under a different task. Migrating to authored comments
 * on the task lines removes that caveat, which is what the note above the old
 * implementation said it would be: a one-line change when it was wanted.
 *
 * MINTING IS KEPT AS A FALLBACK, deliberately. A task line without a comment
 * still gets a positional id rather than failing the build, so a phase can be
 * authored before it is banded and a partial migration is not a broken build.
 * The counters above make the incompleteness visible instead of silent.
 */
function numberedWithIds(lines, phaseId, rel, fail) {
  const out = [];
  for (const line of lines) {
    if (!/^\d+\.\s+/.test(line)) continue;

    const body = line.replace(/^\d+\.\s+/, "");
    const m = body.match(TASK_COMMENT);

    let id;
    let band = null;
    let energy = null;
    if (m) {
      id = m[1];
      band = m[2] || null;
      energy = m[3] || null;
      authoredTaskCount++;
      if (band && !BANDS.includes(band)) {
        fail(rel, 'task ' + id + ' has unknown band "' + band + '"');
        band = null;
      }
      if (energy && !ENERGIES.includes(energy)) {
        fail(rel, 'task ' + id + ' has unknown energy "' + energy + '"');
        energy = null;
      }
    } else {
      id = phaseId + "-t" + String(out.length + 1).padStart(2, "0");
      mintedTaskCount++;
    }
    if (band) bandedTaskCount++;
    if (energy) energisedTaskCount++;

    // Strip the comment from the text. `cyber-05-t01` has indented sub-bullets
    // under it, and they belong to the task's prose rather than to a separate
    // task — the numbered-line filter above keeps them out of `out`, and the
    // text itself is flattened to one line, which is how every other task reads.
    out.push({
      id,
      text: body.replace(/<!--.*?-->/, "").replace(/\s+/g, " ").trim(),
      band,
      energy,
    });
  }
  return out;
}

const textOf = (lines) => lines.join("\n").trim();

function firstPara(lines) {
  for (const block of lines.join("\n").split(/\n\s*\n/)) {
    const t = block.replace(/\s+/g, " ").trim();
    if (t && !t.startsWith("-") && !t.startsWith("|") && !t.startsWith("###")) return t;
  }
  return "";
}

function parseTools(lines, file) {
  const out = [];
  const rows = lines.filter((l) => l.trim().startsWith("|"));
  for (const row of rows) {
    const cells = row.split("|").slice(1, -1).map((c) => c.trim());
    if (cells.length === 0) continue;
    if (cells[0] === "Tool") continue;
    if (/^-+$/.test(cells[0].replace(/[:\s]/g, ""))) continue;
    if (cells.length < 6) {
      fail(file, "tools row has " + cells.length + " columns, expected 6: " + cells[0]);
      continue;
    }
    const t = {
      name: cells[0],
      purpose: cells[1],
      cost: cells[2],
      url: cells[3],
      task: cells[4],
      freeAlternative: cells[5],
    };
    if (/paid|freemium/i.test(t.cost) && !t.freeAlternative) {
      fail(file, "paid/freemium tool without a free alternative: " + t.name);
    }
    out.push(t);
  }
  return out;
}

function parseChecklist(lines, file) {
  const out = [];
  for (const line of lines) {
    if (!line.startsWith("- [ ]")) continue;
    const m = line.match(/<!--\s*id:\s*([^\s]+)(?:\s+energy:\s*([a-z]+))?\s*-->/);
    if (!m) {
      fail(file, "checklist line without an id comment: " + line.slice(0, 60));
      continue;
    }
    out.push({
      id: m[1],
      text: line.replace(/^- \[ \]\s*/, "").replace(/<!--.*?-->/, "").trim(),
      energy: m[2] || null,
    });
  }
  return out;
}

/**
 * Multiple-choice quiz, authored in the phase file as a `## Quiz` section.
 *
 * The format reuses Markdown task-list syntax — `- [x]` marks the correct
 * option, `- [ ]` the rest — so the quiz reads correctly on GitHub and on paper
 * with no new vocabulary to learn. That matters more than it looks: the print
 * stylesheet exists so a phase can be studied offline, and a quiz encoded as
 * HTML or JSON would be the one section that vanished on paper.
 *
 * WHY THIS FAILS LOUDLY
 * A quiz is a claim that one answer is right. A malformed one is therefore
 * worse than a missing one: the reader is told their correct answer is wrong,
 * or handed a question with no answer at all. Every failure mode below is a
 * build error rather than a silent skip, following the same reasoning as the
 * resource-line check above.
 *
 * The energy value reuses the checklist vocabulary (`low`/`normal`/`high`)
 * rather than inventing a second scale, so anything that reads energy already
 * understands a quiz question.
 */
function parseQuiz(lines, phaseId, file) {
  const out = [];
  let cur = null;
  const ids = new Set();

  const flush = () => {
    if (!cur) return;
    const marked = cur.options.filter((o) => o.correct);
    if (marked.length !== 1) {
      fail(
        file,
        "quiz question " + cur.id + " has " + marked.length + " correct answers (expected exactly 1)"
      );
    }
    if (cur.options.length < 2) {
      fail(file, "quiz question " + cur.id + " has " + cur.options.length + " option(s) (expected at least 2)");
    }
    if (!cur.explanation) {
      fail(file, "quiz question " + cur.id + " has no **Why:** explanation");
    }
    out.push({
      id: cur.id,
      question: cur.question,
      energy: cur.energy,
      options: cur.options,
      explanation: cur.explanation,
    });
    cur = null;
  };

  for (const line of lines) {
    // `### Q1. text <!-- id: … energy: … -->`
    const h = line.match(/^###\s+(.*)$/);
    if (h) {
      flush();
      const idm = h[1].match(/<!--\s*id:\s*([^\s]+)(?:\s+energy:\s*([a-z]+))?\s*-->/);
      if (!idm) {
        fail(file, "quiz question without an id comment: " + h[1].slice(0, 60));
        continue;
      }
      if (ids.has(idm[1])) fail(file, "duplicate quiz id: " + idm[1]);
      ids.add(idm[1]);
      if (idm[2] && !ENERGIES.includes(idm[2])) {
        fail(file, 'quiz question ' + idm[1] + ' has unknown energy "' + idm[2] + '"');
      }
      cur = {
        id: idm[1],
        // The `Q1.` label is stripped rather than kept: it is a reading aid in
        // the Markdown, and the site numbers the questions itself. Keeping it
        // renders "Q1. Q1. What does…" on the page, which is how this was
        // caught — the build reported the label as part of the question text.
        question: h[1]
          .replace(/<!--.*?-->/, "")
          .replace(/^\s*Q\d+\.\s*/i, "")
          .replace(/\s+/g, " ")
          .trim(),
        energy: idm[2] || null,
        options: [],
        explanation: null,
      };
      continue;
    }

    if (!cur) continue;

    const opt = line.match(/^-\s+\[([ xX])\]\s+(.*)$/);
    if (opt) {
      cur.options.push({
        text: opt[2].replace(/<!--.*?-->/, "").replace(/\s+/g, " ").trim(),
        correct: opt[1].toLowerCase() === "x",
      });
      continue;
    }

    const why = line.match(/^\*\*Why:\*\*\s*(.*)$/);
    if (why) {
      cur.explanation = why[1].replace(/\s+/g, " ").trim();
      continue;
    }
  }
  flush();

  if (out.length === 0 && lines.some((l) => l.trim() !== "")) {
    fail(file, "## Quiz section has prose but no parseable questions");
  }
  return out;
}

function buildPhase(file) {
  const rel = relative(CONTENT, file).replace(/\\/g, "/");
  const raw = readFileSync(file, "utf8");
  const { data: fm, body } = parseFrontMatter(raw, rel);
  if (!fm) return null;

  const sec = sections(body);
  for (const h of MANDATORY) {
    if (!sec[h]) fail(rel, "missing mandatory section: ## " + h);
  }

  const topics = OPTIONAL.filter((h) => sec[h]).map((h) => ({
    heading: h,
    items: bullets(sec[h]),
  }));

  const fvp = subsections(sec["Free vs Paid"] || []);

  // The lesson heading is `## Lesson: <Title>`, so find the section key that
  // starts with "Lesson" rather than assuming an exact title.
  const lessonKey = Object.keys(sec).find((h) => h.startsWith(LESSON));
  const lessonTitle = lessonKey ? lessonKey.replace(/^Lesson:\s*/, "") : null;
  const lesson = lessonKey
    ? parseLesson(sec[lessonKey].join("\n"))
    : { blocks: [], toc: [], unknown: [] };

  // An unhandled construct would render as plain text on the site, so fail the
  // build rather than shipping a page that silently drops meaning.
  for (const line of lesson.unknown) {
    fail(rel, "lesson contains an unsupported construct: " + line);
  }

  return {
    id: fm.id,
    track: fm.track,
    phase: fm.phase,
    order: fm.order,
    title: fm.title,
    duration: fm.duration,
    durationWeeks: fm.duration_weeks,
    energyMix: fm.energy_mix || [],
    deliverable: fm.deliverable || null,
    goal: firstPara(sec["Goal of this phase"] || []),
    skills: bullets(sec["Skills you'll gain"] || []),
    topics,
    tools: parseTools(sec["Tools for This Phase"] || [], rel),
    // A resource line must be "Name — https://…". CONTENT-GUIDE.md requires
    // names and links, so a line that does not match is an authoring error, not
    // an entry without a link. Failing loudly here keeps this script's promise
    // that a contract violation stops the build; a silent { url: null } would
    // surface later as an unlinked resource in the UI, far from its cause.
    resources: bullets(sec["Free/cheap resources"] || []).map((b) => {
      const m = b.match(/^(.*?)\s+—\s+(https?:\/\/\S+)$/);
      if (!m) {
        const hasUrl = /https?:\/\//.test(b);
        fail(
          rel,
          hasUrl
            ? 'resource line has a URL but the separator is not " — ": ' + b
            : "resource line has no URL — expected \"Name — https://…\": " + b
        );
        return { name: b, url: null };
      }
      return { name: m[1].trim(), url: m[2] };
    }),
    tasks: numberedWithIds(sec["Hands-on practice tasks"] || [], fm.id, rel, fail),
    deliverableItems: bullets(sec["Deliverable / proof of work"] || []),
    checklist: parseChecklist(sec["Checklist"] || [], rel),
    quiz: parseQuiz(sec["Quiz"] || [], fm.id, rel),
    lessonTitle,
    lessonBlocks: lesson.blocks,
    lessonToc: lesson.toc,
    exitCriteria: firstPara(sec["You're ready to move on when..."] || []),
    freeVsPaid: {
      freeEnough: textOf(fvp["What's free and enough"] || []),
      paidUpgrade: textOf(fvp["What's paid and why you'd upgrade"] || []),
      whenWorthPaying: textOf(fvp["When it's worth paying"] || []),
    },
    sourcePath: "career-roadmaps/" + rel,
  };
}

// --- main ---

const files = walk(CONTENT).filter((f) => /-phase-[a-z0-9-]+\.md$/.test(basename(f))).sort();
// Every track the pipeline knows about. A `track:` value in a phase's
// front-matter that is not named here fails the build below rather than being
// silently dropped — which is what stops a new track half-shipping, because the
// track's own JSON is only emitted for a key that already exists.
const KNOWN_TRACKS = ["it", "cyber", "advance"];
const byTrack = {};
for (const t of KNOWN_TRACKS) byTrack[t] = [];

for (const f of files) {
  const p = buildPhase(f);
  if (!p) continue;
  if (!byTrack[p.track]) fail(relative(CONTENT, f), "unknown track: " + p.track);
  else byTrack[p.track].push(p);
}

for (const track of Object.keys(byTrack)) {
  const ids = byTrack[track].map((p) => p.id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) fail(track, "duplicate phase id(s): " + [...new Set(dupes)].join(", "));
}

// The shared strategy documents are built BEFORE the error check, not after,
// because `buildShared` reports contract violations through the same `fail`
// channel. Calling it later would push errors into an array nobody reads again
// — a build that fails silently, which is the failure mode this whole pipeline
// exists to avoid.
//
// It takes the CONTENT root rather than a single directory, because the
// documents now come from two tracks: `career-roadmaps/shared/` and three
// standalone files in `career-roadmaps/cybersec-roadmap/` that are not phases
// and so are invisible to the phase walk above. Each DOCS entry names its own
// directory. See shared-content.mjs and D-020.
const shared = buildShared(CONTENT, (m) => fail("shared", m));
// Exam papers are their own small, structured collection, emitted beside the
// shared-document payload so the UI can render certification and curriculum
// diagnostics without bundling source Markdown or duplicating question data.
const exams = buildExams(CONTENT, (m) => fail("exams", m));

if (errors.length) {
  console.error("CONTENT BUILD FAILED — " + errors.length + " error(s):");
  for (const e of errors) console.error("  " + e);
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });
mkdirSync(join(OUT, "lessons"), { recursive: true });
const stamp = new Date().toISOString();
let totalIds = 0;
let quizQuestionCount = 0;
let quizPhaseCount = 0;
let totalLessonBytes = 0;
// Collected across both tracks, then emitted as one search index after the loop.
const searchInput = [];

for (const track of Object.keys(byTrack)) {
  const phases = byTrack[track].sort((a, b) => a.order - b.order);

  // Lesson bodies are the bulk of the content — roughly 2 MB of JSON across both
  // tracks, against ~50 KB of everything else. Inlining them made the single JS
  // bundle 1.9 MB and delayed first paint for a page that needs at most one
  // lesson. They are emitted as one file per phase and imported dynamically by
  // the site, so a reader downloads only the lesson they open.
  for (const p of phases) {
    const blocks = p.lessonBlocks || [];
    const toc = p.lessonToc || [];
    delete p.lessonBlocks;
    delete p.lessonToc;

    const rel = "lessons/" + p.id + ".json";
    const payload = { id: p.id, title: p.lessonTitle, blocks, toc };
    const text = JSON.stringify(payload);
    totalLessonBytes += Buffer.byteLength(text, "utf8");
    writeFileSync(join(OUT, rel), text + "\n", "utf8");

    searchInput.push({
      id: p.id,
      track,
      phaseTitle: p.title,
      title: p.lessonTitle,
      blocks,
    });

    // The phase record keeps the path and a couple of cheap facts the dashboard
    // can use without loading the lesson.
    p.lessonPath = rel;
    p.lessonBlockCount = blocks.length;
    p.lessonHeadingCount = toc.length;
  }

  const payload = {
    track,
    generatedAt: stamp,
    phaseCount: phases.length,
    phases,
  };
  writeFileSync(join(OUT, track + ".json"), JSON.stringify(payload, null, 2) + "\n", "utf8");
  const ids = phases.reduce((n, p) => n + p.checklist.length, 0);
  totalIds += ids;
  // Quiz coverage, counted per phase so a phase that gains one is visible.
  for (const p of phases) {
    if (p.quiz.length > 0) {
      quizPhaseCount++;
      quizQuestionCount += p.quiz.length;
    }
  }
  console.log(track + ".json — phases=" + phases.length + " taskIds=" + ids + " quiz=" +
    phases.reduce((n, p) => n + p.quiz.length, 0));
}

// One search index for the whole curriculum, emitted after both tracks so a
// query can cross from IT into cyber. It holds term -> segment-id postings and
// no prose; the site fetches it once, on the reader's first search, and renders
// snippets from the lesson file it already has. See scripts/search-index.mjs
// for the measurements behind that decision.
const search = buildSearchIndex(searchInput);
const searchText = JSON.stringify(search) + "\n";
writeFileSync(join(OUT, "search.json"), searchText, "utf8");
const searchBytes = Buffer.byteLength(searchText, "utf8");
const termCount = search.terms ? search.terms.split("\n").length : 0;

console.log("");
console.log("wrote " + Object.keys(byTrack).length + " index files to " + relative(ROOT, OUT).replace(/\\/g, "/"));
console.log("wrote " + KNOWN_TRACKS.reduce((n, t) => n + byTrack[t].length, 0) + " lesson files (" +
  Math.round(totalLessonBytes / 1024) + " KB) to " + relative(ROOT, join(OUT, "lessons")).replace(/\\/g, "/"));
console.log("wrote search.json — " + search.segments.length + " segments, " +
  termCount + " terms (" + Math.round(searchBytes / 1024) + " KB, " +
  Math.round((searchBytes / totalLessonBytes) * 100) + "% of lesson bytes)");
console.log("total phase task IDs: " + totalIds);
// Quiz coverage, reported the same way task banding is: a phase without a quiz
// is a valid build during the rollout, but how far the rollout has reached must
// be visible rather than assumed. Silent partial coverage reads as "every phase
// is quizzed" to anyone who only sees the build succeed.
console.log(
  "quizzes: " + quizQuestionCount + " question(s) across " + quizPhaseCount +
  " of " + KNOWN_TRACKS.reduce((n, t) => n + byTrack[t].length, 0) + " phase(s)"
);

const sharedText = JSON.stringify(shared, null, 2) + "\n";
writeFileSync(join(OUT, "shared.json"), sharedText, "utf8");
const sharedBytes = Buffer.byteLength(sharedText, "utf8");
const resourceTotal = shared.docs.reduce((n, d) => n + (d.resourceCount || 0), 0);
const blockTotal = shared.docs.reduce((n, d) => n + (d.blockCount || 0), 0);
console.log(
  "wrote shared.json — " + shared.docs.length + " document(s), " +
  blockTotal + " block(s), " + resourceTotal + " resource(s) (" +
  Math.round(sharedBytes / 1024) + " KB)"
);
const examsText = JSON.stringify(exams, null, 2) + "\n";
writeFileSync(join(OUT, "exams.json"), examsText, "utf8");
console.log("wrote exams.json — " + exams.papers.length + " papers, " + exams.papers.reduce((n, p) => n + p.questions.length, 0) + " questions");

// Task-band coverage. During the migration from minted to authored ids this
// line is the honest state of the corpus, and it is printed rather than
// asserted because a half-migrated curriculum is a valid build — a phase can be
// written before it is banded. What would NOT be valid is that incompleteness
// being invisible: a build that silently mints an id for a task nobody judged
// looks identical to one where every task carries a band, and the time-aware
// picker would then quietly offer unjudged tasks as if they had been measured.
console.log(
  "task bands: " + bandedTaskCount + " banded, " +
  (authoredTaskCount - bandedTaskCount) + " authored without a band, " +
  mintedTaskCount + " still minted from position"
);
console.log(
  "task energy: " + energisedTaskCount + " of " + authoredTaskCount +
  " practice task(s) carry an energy value"
);
if (mintedTaskCount > 0) {
  console.log(
    "  note: " + mintedTaskCount + " task(s) have no authored `<!-- id: … band: … -->` " +
    "comment, so they carry a positional id and no band."
  );
}