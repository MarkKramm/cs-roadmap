// Readability scan across all phase lessons.
// Measures the things a reader actually feels: paragraph length, sentence
// length, heading frequency, table/list usage, and where the dense blocks are.
// Read-only.
import fs from 'node:fs';
import path from 'node:path';

const FENCE = '`'.repeat(3);
// Every track directory this scan reads. A new track is invisible to the audit
// until it is named here, and the failure mode is the one this repository keeps
// recording: a clean report that never looked at the new files. The loop below
// prints a note when a declared track has no directory yet, so "nothing to
// report" can never be confused with "nothing was read".
const tracks = ['it-roadmap', 'cybersec-roadmap', 'advance-roadmap'];

// Two thresholds, deliberately different.
// EDITORIAL is the standard the writing is held to and is reported, never
// gated: a 92-word paragraph is worth splitting, not a build failure.
// CEILING is the gate. It lived at 150 while four paragraphs sat over 90 and
// the backlog had to be cleared first; now that it is, 110 enforces the
// editorial standard without failing on every clarification a writer adds.
const EDITORIAL = 90;
const CEILING = 110;

const rows = [];

for (const track of tracks) {
  const dir = path.join('career-roadmaps', track);
  // Declared tracks can exist before their first phase file does; see the note
  // in audit-refs.mjs. A silent skip here would report a clean track average
  // for a track that was never read.
  if (!fs.existsSync(dir)) {
    console.log(`note: ${track} — no directory yet, skipped`);
    continue;
  }
  for (const f of fs.readdirSync(dir).sort()) {
    // Phases only: two-digit numbers from 01 (01 … 14), excluding 00-overview,
  // which is a strategy document and has no lesson region. The earlier
    // `^0[1-9]-` matched only 01–09, so phases 10 and above were silently left
    // out of the audit — a phase could fall outside the targets unreported.
    if (!/^(?!00-)\d{2}-.*\.md$/.test(f)) continue;
    const lines = fs.readFileSync(path.join(dir, f), 'utf8').split('\n');

    // Isolate the lesson region.
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
    if (!start || !end) continue;

    const body = lines.slice(start.line, end.line - 1);

    // Split into prose paragraphs, ignoring fences, tables, lists, headings.
    const paras = [];
    let cur = [];
    let fence = false;
    for (const l of body) {
      if (l.trimStart().startsWith(FENCE)) {
        fence = !fence;
        if (!fence) { if (cur.length) { paras.push(cur.join(' ')); cur = []; } }
        continue;
      }
      if (fence) continue;
      const t = l.trim();
      const isBlock = t === '' || t.startsWith('#') || t.startsWith('|') ||
        /^[-*] /.test(t) || /^\d+\. /.test(t) || t.startsWith('>');
      if (isBlock) { if (cur.length) { paras.push(cur.join(' ')); cur = []; } continue; }
      cur.push(t);
    }
    if (cur.length) paras.push(cur.join(' '));

    const words = (s) => s.split(/\s+/).filter(Boolean).length;
    const totalWords = body.reduce((n, l) => n + words(l), 0);
    const pWords = paras.map(words);
    const sentences = paras.flatMap((p) => p.split(/(?<=[.!?])\s+/)).filter((s) => s.trim());
    const sWords = sentences.map(words);

    // Longest paragraph: the wall-of-text risk.
    const longest = pWords.length ? Math.max(...pWords) : 0;

    // Per-paragraph density.
    //
    // The average alone cannot see a single 190-word wall: one such paragraph
    // among twenty short ones barely moves the mean, so a phase reports a
    // healthy average while still being miserable to read at that spot. These
    // counts make the individual offenders visible and gateable.
    //
    // The worst paragraph ever found here was 193 words, in IT Phase 1.
    const over90 = pWords.filter((n) => n > EDITORIAL).length;
    const overCeiling = pWords.filter((n) => n > CEILING).length;

    const h3 = heads.filter((h) => h.level === 3 && h.line > start.line && h.line < end.line).length;
    const h4 = heads.filter((h) => h.level === 4 && h.line > start.line && h.line < end.line).length;
    const tables = body.filter((l) => l.trim().startsWith('|')).length;
    const codeLines = body.filter((l) => l.trim().startsWith(FENCE)).length;

    const avg = (a) => (a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : 0);

    rows.push({
      track,
      file: f.replace(/\.md$/, ''),
      words: totalWords,
      paras: paras.length,
      avgPara: avg(pWords),
      maxPara: longest,
      over90,
      overCeiling,
      avgSent: avg(sWords),
      h3, h4,
      wordsPerHeading: h3 + h4 ? Math.round(totalWords / (h3 + h4)) : totalWords,
      tables,
      codeBlocks: Math.floor(codeLines / 2),
    });
  }
}

const pad = (s, n) => String(s).padEnd(n);
const padL = (s, n) => String(s).padStart(n);

console.log(pad('phase', 40) + padL('words', 7) + padL('paras', 7) + padL('avgP', 6) + padL('maxP', 6) + padL('>' + CEILING, 6) + padL('avgS', 6) + padL('h3/4', 6) + padL('w/head', 8) + padL('tbl', 5) + padL('code', 6));
console.log('-'.repeat(103));
for (const r of rows) {
  console.log(
    pad(r.file.slice(0, 39), 40) + padL(r.words, 7) + padL(r.paras, 7) + padL(r.avgPara, 6) +
    padL(r.maxPara, 6) + padL(r.overCeiling, 6) + padL(r.avgSent, 6) + padL(r.h3 + '/' + r.h4, 6) +
    padL(r.wordsPerHeading, 8) + padL(r.tables, 5) + padL(r.codeBlocks, 6),
  );
}

console.log('\nWorst offenders for reading comfort:');
console.log('  Longest single paragraphs:');
[...rows].sort((a, b) => b.maxPara - a.maxPara).slice(0, 5)
  .forEach((r) => console.log(`    ${pad(r.file.slice(0, 42), 44)} ${r.maxPara} words`));
console.log('  Most words per heading (density):');
[...rows].sort((a, b) => b.wordsPerHeading - a.wordsPerHeading).slice(0, 5)
  .forEach((r) => console.log(`    ${pad(r.file.slice(0, 42), 44)} ${r.wordsPerHeading} w/heading`));
console.log('  Longest average sentence:');
[...rows].sort((a, b) => b.avgSent - a.avgSent).slice(0, 5)
  .forEach((r) => console.log(`    ${pad(r.file.slice(0, 42), 44)} ${r.avgSent} words/sentence`));

// ---------- track-level comparison ----------
// The per-phase table is hard to read as a trend; this is the summary that
// actually drives a decision about which track needs editorial work.
//
// The track comes from the path the row was read from, not from a hardcoded
// list of phase names. The earlier version listed the original eight cyber
// phases by name, so the six modules added as 09–14 were counted as IT and the
// cyber average described only part of the track.
const groups = { IT: [], CYBER: [], ADVANCE: [] };
for (const r of rows) {
  const key = r.track === 'cybersec-roadmap' ? 'CYBER'
    : r.track === 'advance-roadmap' ? 'ADVANCE'
    : 'IT';
  groups[key].push(r);
}

console.log('\n=== track averages (the number that matters) ===');
const avgOf = (g, f) => (g.reduce((n, x) => n + f(x), 0) / g.length);
for (const k of ['IT', 'CYBER', 'ADVANCE']) {
  const g = groups[k];
  // An empty group would divide by zero and print NaN rather than saying so.
  // A track with no phase files is a real state (the track exists before its
  // first phase is written), so it is reported plainly instead of crashing.
  if (!g.length) { console.log(`  ${pad(k, 8)} phases=0`); continue; }
  console.log(
    `  ${pad(k, 6)} phases=${g.length}` +
    `  avg para=${avgOf(g, (x) => x.avgPara).toFixed(1)}` +
    `  avg sentence=${avgOf(g, (x) => x.avgSent).toFixed(1)}` +
    `  words/heading=${Math.round(avgOf(g, (x) => x.words) / avgOf(g, (x) => x.h3 + x.h4))}` +
    `  tables/phase=${avgOf(g, (x) => x.tables).toFixed(1)}` +
    `  longest para=${Math.max(...g.map((x) => x.maxPara))}`,
  );
}

console.log('\nReadability targets: avg para <= 45 words, avg sentence <= 18, at least 8 tables/phase.');
const problems = rows.filter((r) => r.avgPara > 45 || r.avgSent > 18 || r.tables < 8);
console.log(`\nPhases outside the target: ${problems.length} of ${rows.length}`);
for (const p of problems) {
  const why = [];
  if (p.avgPara > 45) why.push(`para ${p.avgPara}`);
  if (p.avgSent > 18) why.push(`sentence ${p.avgSent}`);
  if (p.tables < 8) why.push(`tables ${p.tables}`);
  console.log(`  ${pad(p.file.slice(0, 40), 42)} ${why.join(', ')}`);
}

// ---------- per-paragraph density ----------
// Reported separately from the average-based gate above, because it catches a
// different defect: the average passes while a single paragraph is unreadable.
console.log('\n=== paragraph density ===');
const dense = rows.filter((r) => r.over90 > 0).sort((a, b) => b.over90 - a.over90);
const totalOver90 = rows.reduce((n, r) => n + r.over90, 0);
const totalOverCeiling = rows.reduce((n, r) => n + r.overCeiling, 0);
console.log(`Paragraphs over ${EDITORIAL} words: ${totalOver90} across ${dense.length} phases.`);
console.log(`Paragraphs over ${CEILING} words: ${totalOverCeiling}.`);
if (dense.length) {
  console.log('  ' + pad('phase', 42) + padL('>' + EDITORIAL, 5) + padL('>' + CEILING, 6) + padL('max', 5));
  for (const r of dense) {
    console.log('  ' + pad(r.file.slice(0, 40), 42) + padL(r.over90, 5) + padL(r.overCeiling, 6) + padL(r.maxPara, 5));
  }
}

// Gate: CEILING is the hard ceiling. It was 150 until 2026-09-16, when the four
// paragraphs over the editorial target were split and the backlog went to zero;
// with nothing left to grandfather, the gate moved down to where the editorial
// standard actually is. It stays above EDITORIAL on purpose, so the build fails
// on a genuine wall of text without blocking on every paragraph that merely
// wants splitting — the failure that keeps a gate honest is one it can pass.
const tooLong = rows.filter((r) => r.overCeiling > 0);
if (tooLong.length) {
  console.log(`\nFAIL — ${tooLong.length} phase(s) contain a paragraph over ${CEILING} words:`);
  for (const r of tooLong) {
    console.log(`  ${pad(r.file.slice(0, 40), 42)} ${r.overCeiling} paragraph(s), longest ${r.maxPara} words`);
  }
  console.log('Split the paragraph. Keep every word — this is about where the breaks go, not about cutting content.');
  process.exit(1);
}
console.log(`\nNo paragraph exceeds the ${CEILING}-word ceiling.`);
if (totalOver90) {
  console.log(`(${totalOver90} over the ${EDITORIAL}-word editorial target — worth splitting, not a failure.)`);
}