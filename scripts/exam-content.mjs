// Build-time parser for career-roadmaps/exams/ practice papers.
// The Markdown files remain the source of truth; this emits a small structured
// payload so the learning site can render papers without duplicating questions.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

function parseFrontMatter(lines, fail, rel) {
  if (lines[0] !== "---") {
    fail(rel + ": missing front matter");
    return { data: {}, start: 0 };
  }
  const end = lines.indexOf("---", 1);
  if (end < 0) {
    fail(rel + ": unterminated front matter");
    return { data: {}, start: 0 };
  }
  const data = {};
  for (const line of lines.slice(1, end)) {
    const match = line.match(/^([\w-]+):\s*(.*)$/);
    if (match) data[match[1]] = match[2].trim().replace(/^"|"$/g, "");
  }
  return { data, start: end + 1 };
}

function parsePaper(markdown, file, fail) {
  const lines = markdown.split("\n");
  const rel = "career-roadmaps/exams/" + file;
  const { data: meta, start } = parseFrontMatter(lines, fail, rel);
  const curriculum = meta.kind === "curriculum-practice";
  const title = lines.slice(start).find((line) => /^#\s+/.test(line))?.replace(/^#\s+/, "").trim() || meta.exam || file;
  const questions = [];
  let domain = "";
  let current = null;
  let inWhy = false;

  const flush = () => {
    if (!current) return;
    if (!current.explanation.trim()) fail(rel + ": Q" + current.number + " has no explanation");
    if (curriculum && !current.phases.length) fail(rel + ": Q" + current.number + " has no phase mapping");
    questions.push({
      id: meta.id + "-q" + String(current.number).padStart(2, "0"),
      number: current.number,
      domain: current.domain,
      question: current.question.trim(),
      options: current.options,
      explanation: current.explanation.trim(),
      phases: current.phases,
    });
    current = null;
    inWhy = false;
  };

  for (const line of lines.slice(start)) {
    const h2 = line.match(/^## Domain \d+ — (.+)$/);
    if (h2) {
      flush();
      domain = h2[1].replace(/\s*\([^)]*\)\s*$/, "").trim();
      continue;
    }
    if (/^## /.test(line)) {
      flush();
      domain = "";
      continue;
    }
    const qHead = line.match(/^### Q(\d+)\.\s*(.*)$/);
    if (qHead) {
      flush();
      current = { number: Number(qHead[1]), domain, question: qHead[2], options: [], explanation: "", phases: [] };
      continue;
    }
    if (!current) continue;
    const map = line.match(/^<!--\s*phases:\s*(.*?)\s*-->$/);
    if (map) {
      current.phases = map[1].split(/[, ]+/).filter(Boolean);
      continue;
    }
    const option = line.match(/^- \[([ x])\]\s*(.*)$/);
    if (option) {
      inWhy = false;
      current.options.push({ text: option[2].replace(/^\*\*(.*?)\*\*$/, "$1").trim(), correct: option[1] === "x" });
      continue;
    }
    const why = line.match(/^\*\*Why:\*\*\s*(.*)$/);
    if (why) {
      inWhy = true;
      current.explanation += (current.explanation ? " " : "") + why[1].trim();
      continue;
    }
    if (inWhy && line.trim()) current.explanation += " " + line.trim();
    else if (!current.options.length && line.trim() && !line.startsWith("<!--")) {
      current.question += " " + line.trim();
    }
  }
  flush();

  const declared = Number(meta.questions);
  if (!meta.id || !meta.exam) fail(rel + ": missing exam id/title metadata");
  if (declared !== questions.length) fail(rel + ": front matter declares " + declared + " questions but parser found " + questions.length);
  if (curriculum && !meta.scope) fail(rel + ": curriculum practice paper needs a scope");
  return {
    id: meta.id,
    title,
    exam: meta.exam,
    kind: curriculum ? "curriculum-practice" : "certification-practice",
    code: meta.code || "",
    scope: meta.scope || (curriculum ? "" : "Unofficial practice mapped to a published certification blueprint; not vendor-endorsed."),
    questions,
  };
}

export function buildExams(contentRoot, fail) {
  const dir = join(contentRoot, "exams");
  const papers = [];
  for (const file of readdirSync(dir).filter((name) => name.endsWith(".md") && name !== "README.md").sort()) {
    let markdown;
    try {
      markdown = readFileSync(join(dir, file), "utf8");
    } catch {
      fail("could not read exam paper " + file);
      continue;
    }
    papers.push(parsePaper(markdown, file, fail));
  }
  return { generatedAt: new Date().toISOString(), papers };
}
