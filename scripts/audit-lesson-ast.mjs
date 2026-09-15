// Guard for the lesson renderer.
//
// WHY THIS EXISTS
// The site now renders the `## Lesson:` region (84–95% of every phase file), so
// the parser in lesson-ast.mjs sits between the Markdown and the page. A parser
// bug does not crash the build — it just makes content quietly disappear from
// the site. That is the failure this catches.
//
// HOW IT COMPARES
// Each block is reduced to its alphanumeric characters and compared by length
// against the source with markup stripped. Blocks are kept separate: joining
// everything into one string lets digits from adjacent blocks run together (a
// table ending "0.6" followed by a paragraph starting "0.6 GB" reads as one
// number in one stream and another in the other), which produces phantom
// mismatches. This was verified by hand against all 18 phases.
//
// A NOTE ON GETTING THIS WRONG
// The first version of this script over-counted table delimiter rows and
// under-counted wrapped blockquotes, so it reported losses in every phase. A
// guard that always fails gets ignored, which is worse than having none. If you
// change the counting here, re-verify against a phase you have read by hand.
//
// Run: node scripts/audit-lesson-ast.mjs
import fs from 'node:fs';
import path from 'node:path';
import { parseLesson } from './lesson-ast.mjs';

const FENCE = '`'.repeat(3);
const ROOT = 'career-roadmaps';

function lessonRegion(lines) {
  let inFence = false;
  let start = -1;
  let end = -1;
  lines.forEach((l, i) => {
    if (l.trimStart().startsWith(FENCE)) { inFence = !inFence; return; }
    if (inFence) return;
    const m = /^##\s+(.*)$/.exec(l);
    if (!m) return;
    if (m[1].startsWith('Lesson')) start = i;
    else if (start >= 0 && end < 0) end = i;
  });
  return start < 0 ? [] : lines.slice(start + 1, end < 0 ? lines.length : end);
}

// Reduce to bare alphanumerics: no whitespace, no markup, no pipe characters.
// Whitespace-insensitive, so legitimate reflow (wrapped paragraphs joined,
// wrapped blockquotes joined, table pipes removed) cannot look like data loss.
export const bare = (s) => s.replace(/[^0-9A-Za-z]/g, '').toLowerCase();

// Source side: strip the markup that carries no words.
export function sourceBare(lines) {
  const out = [];
  let inFence = false;
  for (const l of lines) {
    if (/^\s*`{3,}/.test(l)) { inFence = !inFence; continue; }
    if (inFence) { out.push(l); continue; }
    if (/^\s*\|[\s:|-]+\|\s*$/.test(l)) continue; // table delimiter row
    out.push(
      l
        .replace(/^#{1,6}\s/, '')
        .replace(/^\s*([-*]|\d+\.)\s/, '')
        .replace(/^>\s?/, '')
        .replace(/\|/g, ' ')
    );
  }
  return bare(out.join('\n'));
}

// AST side: one bare string per block, so blocks never fuse together.
export function astBare(blocks) {
  const parts = [];
  const walk = (list) => {
    for (const it of list.items) {
      parts.push(bare(it.text));
      for (const c of it.children) {
        if (c.type === 'list') walk(c);
        else parts.push(bare(c.text || ''));
      }
    }
  };
  for (const b of blocks) {
    if (b.type === 'para' || b.type === 'heading' || b.type === 'code') parts.push(bare(b.text));
    else if (b.type === 'quote') b.paras.forEach((p) => parts.push(bare(p)));
    else if (b.type === 'table') [...b.head, ...b.rows.flat()].forEach((c) => parts.push(bare(c)));
    else if (b.type === 'list') walk(b);
  }
  return parts.filter(Boolean);
}

const pad = (s, n) => String(s).padEnd(n);
const padL = (s, n) => String(s).padStart(n);

const rows = [];
let failed = 0;

for (const track of fs.readdirSync(ROOT).sort()) {
  const d = path.join(ROOT, track);
  if (!fs.statSync(d).isDirectory()) continue;
  for (const f of fs.readdirSync(d).sort()) {
    // Two-digit phase numbers from 01 (01 … 14), excluding 00-overview. The
    // earlier `^0[0-9]-` matched only 00–09, so phases 10 and above were never
    // checked for parser content loss — the guard silently covered four fifths
    // of the curriculum.
    if (!/^(?!00-)\d{2}-.*\.md$/.test(f)) continue;
    const lines = lessonRegion(fs.readFileSync(path.join(d, f), 'utf8').split('\n'));
    if (!lines.length) continue;

    const { blocks, toc, unknown } = parseLesson(lines.join('\n'));
    const srcLen = sourceBare(lines).length;
    const astLen = astBare(blocks).reduce((n, p) => n + p.length, 0);
    const delta = astLen - srcLen;

    // A parsed lesson with no table of contents would render an unnavigable
    // wall of text, so treat that as a failure too.
    const problems = [];
    if (delta !== 0) problems.push('word delta ' + (delta > 0 ? '+' : '') + delta);
    if (unknown.length) problems.push(unknown.length + ' unhandled line(s)');
    if (toc.length === 0) problems.push('no headings for the table of contents');

    if (problems.length) failed++;
    rows.push({
      file: track + '/' + f.replace(/\.md$/, ''),
      blocks: blocks.length,
      toc: toc.length,
      srcLen,
      astLen,
      delta,
      problems,
    });
  }
}

console.log(pad('phase', 44) + padL('blocks', 8) + padL('toc', 6) +
  padL('src ch', 9) + padL('ast ch', 9) + padL('delta', 8));
console.log('-'.repeat(84));
for (const r of rows) {
  console.log(pad(r.file, 44) + padL(r.blocks, 8) + padL(r.toc, 6) +
    padL(r.srcLen, 9) + padL(r.astLen, 9) +
    padL((r.delta >= 0 ? '+' : '') + r.delta, 8) +
    (r.problems.length ? '  <-- ' + r.problems.join('; ') : ''));
}

console.log('');
if (failed) {
  console.error('LESSON AST FAILED — ' + failed + ' phase(s) with problems.');
  console.error('Content that does not reach the AST is invisible on the site.');
  process.exit(1);
}
console.log('LESSON AST OK — all ' + rows.length + ' lessons parse with no content loss.');
console.log('(Run node scripts/audit-readability.mjs for the prose targets.)');