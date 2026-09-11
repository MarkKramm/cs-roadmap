// Build-time content pipeline (M1 step 2c).
// Reads career-roadmaps/**/NN-phase-*.md and emits
// learning-site/src/data/generated/{it,cyber}.json.
// Contract: docs/CONTENT-SCHEMA.md. Zero dependencies, fails loudly.

import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from "node:fs";
import { join, relative, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

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

function sections(body) {
  const map = {};
  let current = null;
  for (const line of body.split("\n")) {
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
  for (const line of lines) {
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
    resources: bullets(sec["Free/cheap resources"] || []).map((b) => {
      const m = b.match(/^(.*?)\s+—\s+(https?:\/\/\S+)$/);
      return m ? { name: m[1].trim(), url: m[2] } : { name: b, url: null };
    }),
    tasks: numbered(sec["Hands-on practice tasks"] || []),
    deliverableItems: bullets(sec["Deliverable / proof of work"] || []),
    checklist: parseChecklist(sec["Checklist"] || [], rel),
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
const stamp = new Date().toISOString();
let totalIds = 0;

for (const track of Object.keys(byTrack)) {
  const phases = byTrack[track].sort((a, b) => a.order - b.order);
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
console.log("wrote " + Object.keys(byTrack).length + " files to " + relative(ROOT, OUT).replace(/\\/g, "/"));
console.log("total phase task IDs: " + totalIds);