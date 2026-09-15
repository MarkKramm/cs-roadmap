// Guard for the cyber readability pass.
//
// The risk in a restructure is silent deletion: prose gets "tightened" and a
// fact quietly disappears. This compares every phase against the baseline
// captured before the pass began and fails if any lesson got shorter.
//
// Run: node scripts/cyber-restructure-check.mjs
import fs from 'node:fs';
import path from 'node:path';

const FENCE = '`'.repeat(3);
const dir = 'career-roadmaps/cybersec-roadmap';
const basePath = path.join(process.env.TEMP || '.', 'cyber-baseline.json');

if (!fs.existsSync(basePath)) {
  console.error('No baseline at ' + basePath);
  console.error('Run: node scripts/cyber-baseline.mjs  (BEFORE editing anything)');
  process.exit(2);
}
const base = JSON.parse(fs.readFileSync(basePath, 'utf8'));

const words = (s) => s.split(/\s+/).filter(Boolean).length;
const current = {};

for (const f of fs.readdirSync(dir).sort()) {
  // Two-digit phase numbers from 01 (01 … 14), excluding 00-overview.
  // Matching only 01–09 would leave phases 10+ out of the check entirely.
  if (!/^(?!00-)\d{2}-.*\.md$/.test(f)) continue;
  const text = fs.readFileSync(path.join(dir, f), 'utf8');
  const lines = text.split('\n');

  let inFence = false;
  const heads = [];
  lines.forEach((l, i) => {
    if (l.trimStart().startsWith(FENCE)) { inFence = !inFence; return; }
    if (inFence) return;
    const m = /^(#{2,6}) (.+)$/.exec(l);
    if (m) heads.push({ level: m[1].length, text: m[2], line: i + 1 });
  });
  const start = heads.find((h) => h.level === 2 && h.text.startsWith('Lesson'));
  const end = heads.find((h) => h.level === 2 && h.line > (start?.line ?? 0));
  const lessonLines = start && end ? lines.slice(start.line, end.line - 1) : [];

  current[f.replace(/\.md$/, '')] = {
    fileWords: words(text),
    lessonWords: lessonLines.reduce((n, l) => n + words(l), 0),
    tables: lessonLines.filter((l) => l.trim().startsWith('|')).length,
    codeBlocks: Math.floor(lessonLines.filter((l) => l.trim().startsWith(FENCE)).length / 2),
    headings: heads.filter((h) => start && end && h.line > start.line && h.line < end.line).length,
  };
}

const pad = (s, n) => String(s).padEnd(n);
const padL = (s, n) => String(s).padStart(n);

console.log(pad('phase', 34) + padL('lesson before', 14) + padL('after', 8) + padL('delta', 8) + padL('tables', 9) + padL('heads', 8));
console.log('-'.repeat(81));

const problems = [];
let totalBefore = 0;
let totalAfter = 0;

for (const [key, now] of Object.entries(current)) {
  const was = base[key];
  if (!was) { problems.push(`${key}: not in baseline`); continue; }

  totalBefore += was.lessonWords;
  totalAfter += now.lessonWords;
  const delta = now.lessonWords - was.lessonWords;
  const pct = ((delta / was.lessonWords) * 100).toFixed(1);

  console.log(
    pad(key, 34) + padL(was.lessonWords, 14) + padL(now.lessonWords, 8) +
    padL((delta >= 0 ? '+' : '') + delta + ' (' + pct + '%)', 8) +
    padL(was.tables + '->' + now.tables, 9) + padL(was.headings + '->' + now.headings, 8),
  );

  // The core guarantee: nothing was lost.
  if (delta < 0) {
    problems.push(`${key}: lesson SHRANK by ${-delta} words (${pct}%) — content may have been removed`);
  }
}

console.log('-'.repeat(81));
console.log(pad('TOTAL', 34) + padL(totalBefore, 14) + padL(totalAfter, 8) +
  padL((totalAfter - totalBefore >= 0 ? '+' : '') + (totalAfter - totalBefore), 8));

console.log('');
if (problems.length > 0) {
  console.error('CONTENT PRESERVATION FAILED — ' + problems.length + ' problem(s):');
  for (const p of problems) console.error('  ' + p);
  process.exit(1);
}
console.log('CONTENT PRESERVATION OK — no phase lost content.');
console.log('(Run node scripts/audit-readability.mjs to check the density targets.)');