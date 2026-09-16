// One-time migration (M1 step 2b): add YAML front-matter and stable task IDs
// to every phase file. Idempotent: files that already have front-matter are
// skipped, so re-running is safe. Contract: docs/CONTENT-SCHEMA.md

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = join(ROOT, "career-roadmaps");

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function section(lines, heading) {
  const start = lines.findIndex((l) => l.trim() === "## " + heading);
  if (start === -1) return null;
  const body = [];
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].startsWith("## ")) break;
    body.push(lines[i]);
  }
  return body;
}

function firstParagraph(body) {
  if (!body) return "";
  for (const block of body.join("\n").split(/\n\s*\n/)) {
    const t = block.replace(/\s+/g, " ").trim();
    if (t && !t.startsWith("-") && !t.startsWith("|") && !t.startsWith("```")) return t;
  }
  return "";
}

function yamlString(s) {
  return '"' + String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
}

function energyFor(line) {
  return /^- \[ \] I (can explain|understand|memorized)\b/.test(line) ? "low" : "normal";
}

const report = [];
let migrated = 0;
let skipped = 0;
let totalIds = 0;

for (const file of walk(CONTENT).filter((f) => f.endsWith(".md"))) {
  const name = basename(file);
  if (!/-phase-[a-z0-9-]+\.md$/.test(name)) continue;

  const text = readFileSync(file, "utf8");
  if (text.startsWith("---\n")) {
    skipped++;
    report.push("SKIP    " + relative(ROOT, file));
    continue;
  }

  const lines = text.split("\n");
  const rel = relative(CONTENT, file).replace(/\\/g, "/");
  // Directory name to track id. The earlier version was a binary test —
  // `it-roadmap/` meant "it", everything else meant "cyber" — which silently
  // wrote a `cyber` id and a `track: cyber` front-matter into any phase file
  // outside the IT directory. A third track makes that a wrong id rather than a
  // missing one, and a wrong id is worse: ids are permanent and a reader's
  // progress is stored against them. An unmapped directory now throws instead of
  // guessing.
  const TRACK_BY_DIR = {
    "it-roadmap": "it",
    "cybersec-roadmap": "cyber",
    "advance-roadmap": "advance",
  };
  const dirName = rel.split("/")[0];
  const track = TRACK_BY_DIR[dirName];
  if (!track) {
    throw new Error(
      "add-frontmatter: no track id for directory '" + dirName + "' — add it to TRACK_BY_DIR"
    );
  }
  const phaseNum = Number(name.slice(0, 2));
  const phasePad = String(phaseNum).padStart(2, "0");
  const slug = name.replace(/\.md$/, "").replace(/^\d+-/, "").replace(/^phase-/, "");
  const id = track + "-" + phasePad + "-" + slug;

  const title = (lines.find((l) => l.startsWith("# ")) || "# Untitled").slice(2).trim();

  const timeRaw = firstParagraph(section(lines, "Estimated time"));
  const bold = timeRaw.match(/\*\*([^*]+)\*\*/);
  const duration = bold ? bold[1].trim() : timeRaw.split(/\.\s/)[0];
  // For a range like "8–12 weeks", take the upper bound. The curriculum is
  // deliberately conservative about timelines; underestimating causes burnout.
  const range = duration.match(/(\d+)\s*[–-]\s*(\d+)/);
  const wk = range
    ? Number(range[2])
    : duration.match(/(\d+)/)
      ? Number(duration.match(/(\d+)/)[1])
      : null;

  const delBody = section(lines, "Deliverable / proof of work");
  const delMatch = (delBody || []).join("\n").match(/`([^`\n]+\.md)`/);

  const exit = firstParagraph(section(lines, "You're ready to move on when..."));

  const fm = [
    "---",
    "id: " + id,
    "track: " + track,
    "phase: " + phaseNum,
    "order: " + phaseNum * 10,
    "title: " + yamlString(title),
    "duration: " + yamlString(duration),
    "duration_weeks: " + (wk ?? "null"),
    "energy_mix: [low, normal]",
    "deliverable: " + yamlString(delMatch ? delMatch[1] : ""),
    "exit_criteria: " + yamlString(exit),
    "---",
    "",
  ];

  const out = [...fm];
  let inChecklist = false;
  let n = 0;
  for (const line of lines) {
    if (line.trim() === "## Checklist") {
      inChecklist = true;
      out.push(line);
      continue;
    }
    if (inChecklist && line.startsWith("## ")) inChecklist = false;
    if (inChecklist && line.startsWith("- [ ]")) {
      n++;
      totalIds++;
      const cid = track + "-" + phasePad + "-c" + String(n).padStart(2, "0");
      out.push(line + " <!-- id: " + cid + " energy: " + energyFor(line) + " -->");
    } else {
      out.push(line);
    }
  }

  writeFileSync(file, out.join("\n"), { encoding: "utf8" });
  migrated++;
  report.push("MIGRATE " + rel + "  ids=" + n);
}

console.log(report.join("\n"));
console.log("");
console.log("migrated=" + migrated + " skipped=" + skipped + " taskIds=" + totalIds);