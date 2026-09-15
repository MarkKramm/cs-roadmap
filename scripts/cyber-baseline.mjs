// Capture word counts for the cyber lessons so a later comparison can prove the
// restructure added content rather than quietly removing it.
import fs from 'node:fs';
import path from 'node:path';

const FENCE = '`'.repeat(3);
const dir = 'career-roadmaps/cybersec-roadmap';
const out = {};

for (const f of fs.readdirSync(dir).sort()) {
  if (!/^0[1-9]-.*\.md$/.test(f)) continue;
  const text = fs.readFileSync(path.join(dir, f), 'utf8');
  const lines = text.split('\n');

  // Whole file, and the lesson region separately.
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

  const words = (s) => s.split(/\s+/).filter(Boolean).length;
  const key = f.replace(/\.md$/, '');

  const lessonLines = start && end ? lines.slice(start.line, end.line - 1) : [];
  out[key] = {
    fileWords: words(text),
    lessonWords: lessonLines.reduce((n, l) => n + words(l), 0),
    tables: lessonLines.filter((l) => l.trim().startsWith('|')).length,
    codeBlocks: Math.floor(lessonLines.filter((l) => l.trim().startsWith(FENCE)).length / 2),
    headings: heads.filter((h) => start && end && h.line > start.line && h.line < end.line).length,
  };
}

const dest = path.join(process.env.TEMP || '.', 'cyber-baseline.json');
fs.writeFileSync(dest, JSON.stringify(out, null, 2), 'utf8');

console.log('baseline written to ' + dest + '\n');
console.log('phase'.padEnd(36) + 'file'.padStart(7) + 'lesson'.padStart(8) + 'tables'.padStart(8) + 'code'.padStart(6) + 'heads'.padStart(7));
console.log('-'.repeat(72));
let tl = 0;
for (const [k, v] of Object.entries(out)) {
  tl += v.lessonWords;
  console.log(k.padEnd(36) + String(v.fileWords).padStart(7) + String(v.lessonWords).padStart(8) +
    String(v.tables).padStart(8) + String(v.codeBlocks).padStart(6) + String(v.headings).padStart(7));
}
console.log('-'.repeat(72));
console.log('total lesson words: ' + tl);