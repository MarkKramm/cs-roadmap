// Exam paper guard. Checks the structure of every practice paper in career-roadmaps/exams/.
//
// WHY THIS EXISTS
//
// A practice paper can be malformed in ways the reader cannot see: ambiguous answer keys,
// missing explanations, inaccurate domain coverage, or scope links that do not resolve. A
// question with two marked answers still reads perfectly well -- you simply cannot tell which
// one the author intended. A paper whose domain weights no longer match its questions still
// looks like a paper.
//
// Credential papers can inform a learner considering an exam fee; curriculum papers are
// diagnostic-only integrations and must never imply certification readiness or job readiness.
// So the checks here are about the things that would silently mislead them:
//
//   1. Every question has exactly ONE marked answer. Two is ambiguous; zero is unanswerable.
//   2. Every question has a `**Why:**`. A practice question without its explanation teaches
//      nothing -- the explanation IS the teaching, and a correct guess and a correct
//      understanding look identical in a score.
//   3. Question numbering is contiguous from 1 with no duplicates or gaps.
//   4. Every question sits inside a domain section, and the domain weights the paper CLAIMS
//      match the questions actually present. This is the one that matters most: a paper
//      claiming 28% Security operations while carrying 10% would send a reader into the
//      exam under-prepared on its largest domain, and nothing about the page would look
//      wrong.
//   5. Certification papers carry the code, pass mark and blueprint-check date; curriculum
//      papers carry a scope and per-question phase mapping, with no readiness pass threshold.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIR = path.join(ROOT, "career-roadmaps", "exams");
const PAPERS = fs.readdirSync(DIR).filter((f) => f.endsWith(".md") && f !== "README.md").sort();

// The README is not a paper -- it has no questions and no domains -- but it IS the file that
// links to all of them, so it is the one file where a broken link hides the most. Checking
// only the papers would leave the index unverified, which is the same "it has a suite" gap as
// D-070. Its links are checked below, under the same rules as a paper's.
const INDEX = path.join(DIR, "README.md");

const findings = [];
const summary = [];
const fail = (file, line, msg) => findings.push({ file, line, msg });

for (const file of PAPERS) {
  const lines = fs.readFileSync(path.join(DIR, file), "utf8").split("\n");

  // --- front matter -------------------------------------------------------------------
  if (lines[0] !== "---") {
    fail(file, 1, "no front matter block");
    continue;
  }
  const end = lines.indexOf("---", 1);
  if (end < 0) {
    fail(file, 1, "front matter is not closed");
    continue;
  }
  const fm = Object.fromEntries(
    lines.slice(1, end).map((l) => {
      const m = l.match(/^(\w+):\s*(.*)$/);
      return m ? [m[1], m[2].replace(/^"|"$/g, "")] : [null, null];
    }).filter(([k]) => k),
  );
  const curriculumPaper = fm.kind === "curriculum-practice";

  // An unrecognised `kind` must be a failure here in its own right, not silently treated
  // as "certification paper". This guard used to derive `curriculumPaper` from the same
  // boolean the build parser used, so a mistyped kind read as "not curriculum" to BOTH --
  // they agreed, and the paper was filed as certification practice with none of the
  // curriculum safeguards and no finding. Declaring the permitted values here makes the
  // guard able to disagree with a bad input instead of inheriting its premise.
  const KNOWN_KINDS = ["curriculum-practice", "certification-practice"];
  if (fm.kind !== undefined && fm.kind !== "" && !KNOWN_KINDS.includes(fm.kind)) {
    fail(file, 1, `unknown kind \`${fm.kind}\`; expected one of ${KNOWN_KINDS.join(", ")}, or no \`kind\` for a certification paper`);
  }

  const required = curriculumPaper
    ? ["id", "exam", "code", "questions", "scope", "phases", "source"]
    : ["id", "exam", "code", "questions", "pass_mark", "pass_scale", "blueprint_checked", "source"];
  for (const key of required) {
    if (!fm[key]) fail(file, 1, `front matter is missing \`${key}\``);
  }
  if (curriculumPaper && /^(?:pass_mark|pass_scale|blueprint_checked):/m.test(lines.slice(1, end).join("\n"))) {
    fail(file, 1, "curriculum practice metadata must not include certification pass or blueprint fields");
  }

  // --- questions ----------------------------------------------------------------------
  let currentDomain = null;
  const domainCounts = new Map();
  const domainOrder = [];
  const seen = new Map();
  let currentQuestionPhases = [];
  const questionPhaseMap = new Map();
  let qCount = 0;
  let inQuestion = false;
  let markedHere = 0;
  let whyHere = false;
  let qLine = 0;
  let qNum = null;
  let optionCount = 0;
  const optionCounts = [];

  const closeQuestion = () => {
    if (!inQuestion) return;
    if (markedHere !== 1) {
      fail(file, qLine, `Q${qNum} has ${markedHere} marked answer(s); a question must have exactly one`);
    }
    if (!whyHere) {
      fail(file, qLine, `Q${qNum} has no \`**Why:**\` explanation`);
    }
    if (optionCount < 3) {
      fail(file, qLine, `Q${qNum} has ${optionCount} options; 3 or 4 is expected`);
    }
    optionCounts.push(optionCount);
    if (curriculumPaper) {
      if (!currentQuestionPhases.length) fail(file, qLine, `Q${qNum} has no phase mapping`);
      questionPhaseMap.set(qNum, currentQuestionPhases);
    }
    inQuestion = false;
  };

  lines.forEach((line, i) => {
    const dom = line.match(/^## Domain (\d+)[^\n]*/);
    if (dom) {
      closeQuestion();
      const n = Number(dom[1]);
      if (!domainCounts.has(n)) domainOrder.push(n);
      domainCounts.set(n, 0);
      currentDomain = n;
      return;
    }
    // A later non-domain H2 ends the question area.
    if (/^## /.test(line)) {
      closeQuestion();
      currentDomain = null;
      return;
    }

    const q = line.match(/^### Q(\d+)\.\s+\S/);
    if (q) {
      closeQuestion();
      qCount++;
      qNum = Number(q[1]);
      qLine = i + 1;
      inQuestion = true;
      markedHere = 0;
      whyHere = false;
      optionCount = 0;
      currentQuestionPhases = [];
      if (seen.has(qNum)) fail(file, i + 1, `Q${qNum} appears more than once (first at line ${seen.get(qNum)})`);
      seen.set(qNum, i + 1);
      if (currentDomain === null) {
        fail(file, i + 1, `Q${qNum} is not inside a \`## Domain N\` section`);
      } else {
        domainCounts.set(currentDomain, domainCounts.get(currentDomain) + 1);
      }
      return;
    }

    if (inQuestion) {
      const phaseMap = line.match(/^<!--\s*phases:\s*(.*?)\s*-->$/);
      if (phaseMap) {
        currentQuestionPhases = phaseMap[1].split(/[,\s]+/).filter(Boolean);
        for (const id of currentQuestionPhases) {
          if (!/^(?:it|cyber|advance)-\d{2}-[a-z0-9-]+$/.test(id)) {
            fail(file, i + 1, `Q${qNum} has invalid phase id \`${id}\``);
          }
          const trackDir = id.startsWith("it-") ? "it-roadmap" : id.startsWith("cyber-") ? "cybersec-roadmap" : "advance-roadmap";
          const phaseFile = id.replace(/^(?:it|cyber|advance)-/, "").replace(/^(\d{2})-/, "$1-phase-") + ".md";
          if (!fs.existsSync(path.join(ROOT, "career-roadmaps", trackDir, phaseFile))) {
            fail(file, i + 1, `Q${qNum} maps to missing phase \`${id}\``);
          }
        }
      }
      if (/^- \[x\]/.test(line)) markedHere++;
      if (/^- \[ \]/.test(line)) optionCount++;
      if (/^- \[x\]/.test(line)) optionCount++;
      if (/^\*\*Why:\*\*/.test(line)) whyHere = true;
    }
  });
  closeQuestion();

  // --- numbering ----------------------------------------------------------------------
  const nums = [...seen.keys()].sort((a, b) => a - b);
  for (let n = 1; n <= nums.length; n++) {
    if (!seen.has(n)) fail(file, 0, `question numbering has a gap: Q${n} is missing`);
  }
  if (qCount !== nums.length) {
    fail(file, 0, `${qCount} questions parsed but ${nums.length} distinct numbers`);
  }

  // --- declared vs actual -------------------------------------------------------------
  const declared = Number(fm.questions);
  if (declared && declared !== qCount) {
    fail(file, 1, `front matter says ${declared} questions; ${qCount} are present`);
  }
  if (curriculumPaper) {
    const allowedPhases = new Set(String(fm.phases || "").split(",").map((id) => id.trim()).filter(Boolean));
    for (const [number, ids] of questionPhaseMap) {
      for (const id of ids) {
        if (!allowedPhases.has(id)) fail(file, seen.get(number), `Q${number} maps to ${id}, which is not in the paper's declared scope`);
      }
    }
    if (!domainCounts.size) fail(file, 1, "curriculum practice paper needs domain sections");
  }

  // --- the domain weights the paper claims ---------------------------------------------
  // The paper states its weighting in a table. Two shapes are supported, and the distinction
  // matters:
  //
  //   | 4. Name | **28%** | 11 |               -- official weight, then question count
  //   | 4. Name | **28%** | 11 | **28%** |     -- plus the SHARE of this paper
  //
  // A 40-question paper cannot hit a 90-question blueprint exactly: 11% of 40 is 4.4, so the
  // paper rounds and the two columns legitimately differ. When the paper publishes its own
  // share in a later column, THAT is what must match the questions present -- comparing the
  // official weight instead would demand a paper misrepresent its own arithmetic. When there
  // is no share column, the official weight is the only claim being made and is checked.
  const claimed = new Map();
  lines.forEach((line) => {
    const cells = line.split("|").map((c) => c.trim());
    if (cells.length < 5) return;
    const head = cells[1].match(/^(\d+)\.\s+(.+)$/);
    if (!head) return;
    // Find the first percentage cell (the official weight) and the question count.
    const pcts = cells.map((c, i) => [i, c.replace(/\*/g, "")]).filter(([, c]) => /^\d+(?:\.\d+)?%$/.test(c));
    const qCell = cells.find((c) => /^\d+$/.test(c));
    if (!pcts.length || !qCell) return;
    const official = Number(pcts[0][1].replace("%", ""));
    // A second percentage cell is the paper's own share.
    const share = pcts.length > 1 ? Number(pcts[1][1].replace("%", "")) : official;
    claimed.set(Number(head[1]), {
      official,
      share,
      checkShare: pcts.length > 1,
      qs: Number(qCell),
      name: head[2].trim(),
    });
  });

  // --- the question count a domain HEADING claims ---------------------------------------
  // Curriculum papers state their weighting in the heading itself -- "## Domain 3 — OT
  // fundamentals and the safety boundary (6 questions)" -- rather than in a weight table, so
  // the table check below never sees it. That left a real gap: editing a heading's count, or
  // adding a question without updating the heading, changed what the paper claims to test
  // while every other check still passed. The heading is the reader's only summary of the
  // section, which is exactly why it has to be true.
  //
  // The `N questions` form is read strictly so that a heading phrased differently produces a
  // named failure rather than silently being skipped. A heading with no count at all is a
  // defect in its own right, because every domain in every curriculum paper carries one.
  const headingCounts = new Map();
  lines.forEach((line) => {
    const h = line.match(/^## Domain (\d+)\s+—\s+(.*?)\s*\((?:(\d+)\s+questions?)\)\s*$/);
    if (!h) return;
    headingCounts.set(Number(h[1]), { name: h[2].trim(), qs: Number(h[3]) });
  });
  // The percentage-heading convention belongs to the certification papers, which state their
  // official domain weights rather than question counts. Only curriculum papers are expected
  // to carry "(N questions)" in the heading, so the check is scoped to them.
  if (curriculumPaper) {
    const bareDomainHeadings = lines.filter((l) => /^## Domain \d+/.test(l) && !/\(\d+\s+questions?\)\s*$/.test(l));
    if (bareDomainHeadings.length) {
      fail(file, 0, `a domain heading does not state its question count: "${bareDomainHeadings[0].trim()}"`);
    }
    for (const [n, h] of headingCounts) {
      const actual = domainCounts.get(n) ?? 0;
      if (actual !== h.qs) {
        fail(file, 0, `domain ${n} (${h.name}) heading claims ${h.qs} questions but ${actual} are present`);
      }
    }
    // The headings must account for every question, so a question placed outside any domain --
    // or inside a domain whose heading was deleted -- cannot hide from the totals.
    const headingTotal = [...headingCounts.values()].reduce((a, h) => a + h.qs, 0);
    if (headingCounts.size && declared && headingTotal !== declared) {
      fail(file, 0, `domain headings sum to ${headingTotal} questions but the paper declares ${declared}`);
    }
  }

  if (declared && claimed.size) {
    for (const [n, c] of claimed) {
      const actual = domainCounts.get(n) ?? 0;
      if (actual !== c.qs) {
        fail(file, 0, `domain ${n} (${c.name}) claims ${c.qs} questions but ${actual} are present`);
      }      const actualPct = Math.round((actual / declared) * 100);
      // Compare against the paper's own share when it publishes one; otherwise the official
      // weight is the only claim on the page. Tolerance of 1 point absorbs rounding.
      const target = c.checkShare ? c.share : c.official;
      const label = c.checkShare ? "of this paper" : "official weight";
      if (Math.abs(actualPct - target) > 1) {
        fail(file, 0, `domain ${n} (${c.name}) claims ${target}% ${label} but is ${actualPct}%`);
      }
    }
    const totalClaimed = [...claimed.values()].reduce((a, c) => a + c.qs, 0);
    if (totalClaimed !== declared) {
      fail(file, 0, `the weight table sums to ${totalClaimed} questions but the paper declares ${declared}`);
    }
  }

  // --- curriculum references resolve ---------------------------------------------------
  // Each paper ends with a table mapping its domains to the phases that teach them. That
  // table is how a reader who scored badly knows where to go -- so a path that does not
  // exist is the paper's most actionable line being wrong.
  //
  // This check was added AFTER the first draft of all seven papers invented 36 filenames
  // that do not exist (`04-phase-soc-operations.md`, `advance-roadmap/03-phase-cloud-
  // fundamentals.md` and others that were simply guessed from the domain names). Every one
  // of them rendered as a perfectly ordinary backticked path in a table, and not one was
  // noticed until every link was resolved against the filesystem by hand.
  lines.forEach((line, i) => {
    for (const m of line.matchAll(/`((?:it-roadmap|cybersec-roadmap|advance-roadmap|shared)\/[^`]+)`/g)) {
      const rel = m[1];
      if (!fs.existsSync(path.join(ROOT, "career-roadmaps", rel))) {
        fail(file, i + 1, `references \`${rel}\`, which does not exist`);
      }
    }
  });

  // --- relative links between papers resolve -------------------------------------------
  lines.forEach((line, i) => {
    for (const m of line.matchAll(/\]\(([^)#\s]+?)(?:#[^)]*)?\)/g)) {
      const link = m[1];
      if (/^[a-z]+:/i.test(link)) continue; // an absolute URL or mailto, not ours to check
      if (!fs.existsSync(path.join(DIR, link))) {
        fail(file, i + 1, `links to \`${link}\`, which does not exist`);
      }
    }
  });
  summary.push({
    file,
    exam: fm.exam ?? "?",
    code: fm.code ?? "?",
    questions: qCount,
    domains: domainOrder.length,
    avgOptions: optionCounts.length ? (optionCounts.reduce((a, b) => a + b, 0) / optionCounts.length).toFixed(1) : "0",
    checked: fm.blueprint_checked ?? "?",
    curriculum: curriculumPaper,
  });
}

// --- the index's links resolve ---------------------------------------------------------
// The README carries no questions, so it is not a paper -- but it is the only file that links
// to all seven, which makes it the file where a broken link costs the most. See INDEX above.
{
  const lines = fs.readFileSync(INDEX, "utf8").split("\n");
  const linked = new Set();
  lines.forEach((line, i) => {
    for (const m of line.matchAll(/\]\(([^)#\s]+?)(?:#[^)]*)?\)/g)) {
      const link = m[1];
      if (/^[a-z]+:/i.test(link)) continue;
      linked.add(link);
      if (!fs.existsSync(path.join(DIR, link))) {
        fail("README.md", i + 1, `links to \`${link}\`, which does not exist`);
      }
    }
  });
  // Every paper must be linked from the index, or a reader browsing the directory finds a
  // paper the README does not mention -- and a paper nobody links to is one nobody reads.
  for (const p of PAPERS) {
    if (!linked.has(p)) {
      fail("README.md", 0, `does not link to \`${p}\`, so the paper is unreachable from the index`);
    }
  }
}

console.log("Practice papers checked:");
for (const s of summary) {
  console.log(`  ${s.file.padEnd(32)} ${s.code.padEnd(18)} ${String(s.questions).padStart(2)} questions, ${s.domains} domains, ${s.avgOptions} options/q, ${s.curriculum ? "curriculum scope" : "blueprint " + s.checked}`);
}
console.log("");

if (!findings.length) {
  // The total is printed so a figure guard can compare the hand-written counts in the docs
  // against the papers on disk. Those totals were previously unowned by any script, which is
  // how the corpus size stayed wrong in four files after the papers it described had changed.
  const totalQuestions = summary.reduce((n, s) => n + s.questions, 0);
  console.log(`EXAM PAPERS OK — ${PAPERS.length} paper(s) / ${totalQuestions} questions, every question has one answer and an explanation, and every claimed domain weight matches the questions present.`);
  process.exit(0);
}
console.error(`EXAM PAPERS FAILED — ${findings.length} defect(s):`);
console.error("");
for (const f of findings) {
  console.error(`  ${f.file}${f.line ? ":" + f.line : ""}`);
  console.error(`      ${f.msg}`);
}
process.exit(1);
