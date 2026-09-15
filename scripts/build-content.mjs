// Build-time content pipeline (M1 step 2c).
// Reads career-roadmaps/**/NN-phase-*.md and emits
// learning-site/src/data/generated/{it,cyber}.json.
// Contract: docs/CONTENT-SCHEMA.md. Zero dependencies, fails loudly.

import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from "node:fs";
import { join, relative, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { parseLesson } from "./lesson-ast.mjs";

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
    tasks: numbered(sec["Hands-on practice tasks"] || []),
    deliverableItems: bullets(sec["Deliverable / proof of work"] || []),
    checklist: parseChecklist(sec["Checklist"] || [], rel),
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
const byTrack = { it: [], cyber: [] };

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

if (errors.length) {
  console.error("CONTENT BUILD FAILED — " + errors.length + " error(s):");
  for (const e of errors) console.error("  " + e);
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });
mkdirSync(join(OUT, "lessons"), { recursive: true });
const stamp = new Date().toISOString();
let totalIds = 0;
let totalLessonBytes = 0;

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
  console.log(track + ".json — phases=" + phases.length + " taskIds=" + ids);
}

console.log("");
console.log("wrote " + Object.keys(byTrack).length + " index files to " + relative(ROOT, OUT).replace(/\\/g, "/"));
console.log("wrote " + (byTrack.it.length + byTrack.cyber.length) + " lesson files (" +
  Math.round(totalLessonBytes / 1024) + " KB) to " + relative(ROOT, join(OUT, "lessons")).replace(/\\/g, "/"));
console.log("total phase task IDs: " + totalIds);