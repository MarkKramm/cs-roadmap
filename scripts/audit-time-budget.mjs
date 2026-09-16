// Time-budget audit. Exit code 1 on a mismatch, so it can gate CI.
//
// This exists because a comprehension audit of all 23 phases found a class of
// defect that no existing guard could see: arithmetic that only disagrees when
// you read two places at once. Every instance found so far was introduced by an
// edit that changed one place and not the other, which is exactly the failure a
// standing check prevents.
//
//   Cyber 09-14 stated a phase total in the "Estimated time" header that was
//     larger than its own breakdown table, e.g. "60-80 hours" above parts
//     summing to 40-56. The stated minimum exceeded the table's maximum.
//   Cyber 02 stated "40-60 hours" above parts summing to 37-59.
//   Cyber 02 called itself "the heaviest phase in the cyber track" while
//     cyber 06 budgets 120-180 hours.
//   The cyber 00-overview listed phases 9-14 as 4 weeks each while every one
//     of those phase files says 6 weeks in both frontmatter and prose.
//   IT 03 said "20-30 hours across the phase - the scheduled four weeks at
//     5-8 hours a week", and 4 x 8 = 32, not 30.
//
// Four classes are checked, all arithmetic on the text rather than judgement:
//
//   1. A budget table whose parts must sum to the total it prints, either as a
//      "Total" row (cyber 01-03) or as an intro claim above the table
//      (cyber 09-14).
//   2. A stated week range with its minimum above its maximum.
//   3. Frontmatter `duration` / `duration_weeks` disagreeing with the bold
//      lead of the phase's own "Estimated time" line.
//   4. A track overview table listing a different week count than the phase
//      file it points at.
//
// Class 1 is scoped by the table's own `Hours` column header, not by proximity
// to a heading. A schedule table (Weeks / study % / hands-on %) has time-ish
// cells but no Hours column and no total, so it is correctly out of scope; an
// earlier throwaway version of this check summed bare "4-6" cells by accident
// and reported success on three tables out of the corpus. That is the failure
// mode this scoping avoids: a check whose skip path looks like its pass path
// is not a check, so a table that has an Hours column but no checkable claim
// is a failure here, not a silent skip.
//
// Read-only: writes nothing.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'career-roadmaps';
const TRACKS = ['it-roadmap', 'cybersec-roadmap'];

const findings = [];
const note = (file, line, message) => findings.push({ file, line, message });

// A numeric time figure: an optional tilde/about, a number, an optional range.
const NUM = '(\\d+(?:\\.\\d+)?)\\s*(?:[–-]\\s*(\\d+(?:\\.\\d+)?))?';
// A whole cell that is nothing but a time figure, with or without a unit.
const TIME_CELL = new RegExp('^\\s*(?:~|about\\s+)?' + NUM + '\\s*(?:hours?|h)?\\s*$', 'i');
// A time figure embedded in a sentence, e.g. "Roughly 40-56 hours over 6 weeks".
const HOURS_IN_TEXT = new RegExp(NUM + '\\s*hours?', 'i');
const WEEKS_IN_TEXT = new RegExp(NUM + '\\s*weeks?', 'i');

const cellRange = (s) => {
  const m = String(s).match(TIME_CELL);
  return m ? [Number(m[1]), m[2] ? Number(m[2]) : Number(m[1])] : null;
};
const hoursIn = (s) => {
  const m = String(s).match(HOURS_IN_TEXT);
  return m ? [Number(m[1]), m[2] ? Number(m[2]) : Number(m[1])] : null;
};
const weeksIn = (s) => {
  const m = String(s).match(WEEKS_IN_TEXT);
  return m ? [Number(m[1]), m[2] ? Number(m[2]) : Number(m[1])] : null;
};
const overlaps = (a, b) => a[0] <= b[1] && b[0] <= a[1];
const same = (a, b) => a[0] === b[0] && a[1] === b[1];

function listPhaseFiles() {
  const out = [];
  for (const track of TRACKS) {
    const dir = path.join(ROOT, track);
    for (const f of fs.readdirSync(dir).sort()) {
      if (/^\d{2}-phase-.*\.md$/.test(f)) out.push({ track, file: path.join(dir, f) });
    }
  }
  return out;
}

function parseFrontmatter(lines) {
  if (lines[0].trim() !== '---') return null;
  const end = lines.indexOf('---', 1);
  if (end === -1) return null;
  const fm = {};
  for (let i = 1; i < end; i++) {
    const m = lines[i].match(/^([a-z_]+):\s*(.*)$/i);
    if (!m) continue;
    let v = m[2].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    fm[m[1]] = v;
  }
  return { fm, endLine: end + 1 };
}

// Class 1 - budget tables.
function checkBudgetTables(file, rel, lines) {
  let i = 0;
  while (i < lines.length) {
    if (!/^\s*\|/.test(lines[i])) { i++; continue; }
    const startIdx = i;
    const rows = [];
    while (i < lines.length && /^\s*\|/.test(lines[i])) { rows.push({ n: i + 1, line: lines[i] }); i++; }

    const body = rows.filter((r) => !/^\s*\|[\s:|-]+\|\s*$/.test(r.line));
    if (body.length < 2) continue;

    const headerCells = body[0].line.split('|').map((c) => c.trim());
    const hoursCol = headerCells.findIndex((c) => /^hours?$/i.test(c));

    // A Total row makes it a budget table whatever the column headers say.
    const totalRow = body.find((r) => /^\**\s*Total/i.test(r.line.split('|')[1] ?? ''));
    if (hoursCol === -1 && !totalRow) continue; // schedule table, out of scope

    const claim = hoursIn(lines[startIdx - 1] ?? '') ?? hoursIn(lines[startIdx - 2] ?? '');
    const claimLine = hoursIn(lines[startIdx - 1] ?? '') ? startIdx : startIdx - 1;

    const parts = [];
    for (const r of body) {
      if (r === totalRow) continue;
      const cells = r.line.split('|').map((c) => c.trim());
      const idx = hoursCol !== -1 ? hoursCol : cells.length >= 5 ? 2 : 1;
      const rr = cellRange(cells[idx] ?? '');
      if (rr) parts.push(rr);
    }

    const stated = totalRow ? hoursIn(totalRow.line) : claim;
    if (!stated) {
      note(rel, startIdx + 1, 'has an Hours column or a Total row but prints no hour total to check against');
      continue;
    }
    if (!parts.length) {
      note(rel, startIdx + 1, 'prints an hour total but has no numeric time cells to add up');
      continue;
    }
    const lo = parts.reduce((a, b) => a + b[0], 0);
    const hi = parts.reduce((a, b) => a + b[1], 0);
    if (lo !== stated[0] || hi !== stated[1]) {
      note(
        rel,
        totalRow ? totalRow.n : claimLine,
        `parts sum to ${lo}-${hi} hours but the ${totalRow ? 'Total row' : 'line above'} says ${stated[0]}-${stated[1]}`,
      );
    }
  }
}

// Class 2 - inverted ranges anywhere in a phase file.
function checkInvertedRanges(rel, lines) {
  const re = new RegExp('(\\d+(?:\\.\\d+)?)\\s*[–-]\\s*(\\d+(?:\\.\\d+)?)', 'g');
  lines.forEach((line, i) => {
    let m;
    re.lastIndex = 0;
    while ((m = re.exec(line)) !== null) {
      const lo = Number(m[1]);
      const hi = Number(m[2]);
      // Only flag an inverted range that is followed by a time unit, so that
      // a negative number or an unrelated dash pair is not misread.
      const tail = line.slice(m.index + m[0].length, m.index + m[0].length + 12);
      if (lo > hi && /^\s*(hours?|weeks?|days?|minutes?)/i.test(tail)) {
        note(rel, i + 1, `inverted range ${lo}-${hi} (${tail.trim().split(/\s/)[0]})`);
      }
    }
  });
}

// Classes 3 and 4.
const phaseWeeks = new Map(); // "track/phaseNumber" -> week range from frontmatter

const phases = listPhaseFiles();
for (const { track, file } of phases) {
  const rel = path.relative(process.cwd(), file).replace(/\\/g, '/');
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  const parsed = parseFrontmatter(lines);
  if (!parsed) { note(rel, 1, 'has no frontmatter block'); continue; }
  const { fm } = parsed;
  const num = Number((fm.phase ?? path.basename(file).slice(0, 2)).toString());

  checkBudgetTables(file, rel, lines);
  checkInvertedRanges(rel, lines);

  // Class 3 - frontmatter duration vs duration_weeks.
  const durWeeks = weeksIn(fm.duration ?? '');
  if (durWeeks && fm.duration_weeks) {
    const dw = Number(fm.duration_weeks);
    if (dw < durWeeks[0] || dw > durWeeks[1]) {
      note(rel, 1, `duration_weeks ${dw} sits outside duration "${fm.duration}"`);
    }
  }
  // Class 3 - frontmatter duration vs the bold lead of the prose estimate.
  const headIdx = lines.findIndex((l) => /^## Estimated time\s*$/.test(l));
  if (headIdx !== -1) {
    let lead = null;
    for (let j = headIdx + 1; j < Math.min(headIdx + 8, lines.length); j++) {
      const m = lines[j].match(/^\*\*([^*]+)\*\*/);
      if (m) { lead = { text: m[1], n: j + 1 }; break; }
    }
    if (lead) {
      const proseWeeks = weeksIn(lead.text);
      if (proseWeeks && durWeeks && !overlaps(proseWeeks, durWeeks)) {
        note(rel, lead.n, `prose says ${proseWeeks[0]}-${proseWeeks[1]} weeks but frontmatter says "${fm.duration}"`);
      }
    }
  }
  if (durWeeks) phaseWeeks.set(`${track}/${num}`, { rel, weeks: durWeeks, duration: fm.duration ?? '' });
}

// Class 4 - track overview tables vs the phase files they point at.
for (const track of TRACKS) {
  const rel = `${ROOT}/${track}/00-overview.md`;
  const lines = fs.readFileSync(rel, 'utf8').split(/\r?\n/);
  // "saw a table row" is a different question from "am I inside a table right
  // now". Tracking only the latter made this check pass on both overviews for
  // the wrong reason: the final table in a file is always followed by prose,
  // so a live flag is always false by the last line. The first version of this
  // script therefore never cross-checked a single week count.
  let sawPhaseRow = false;
  lines.forEach((line, i) => {
    if (!/^\s*\|/.test(line)) return;
    if (/^\s*\|[\s:|-]+\|\s*$/.test(line)) return;
    const cells = line.split('|').map((c) => c.trim());
    const numCell = cells[1] ?? '';
    if (!/^\d+$/.test(numCell)) return; // header row or non-phase row
    sawPhaseRow = true;
    const listed = weeksIn(cells[3] ?? '') ?? weeksIn(cells[2] ?? '');
    if (!listed) return;
    const key = `${track}/${Number(numCell)}`;
    const actual = phaseWeeks.get(key);
    if (!actual) {
      note(rel, i + 1, `lists phase ${numCell} but no matching phase file declares a duration`);
      return;
    }
    if (!overlaps(listed, actual.weeks)) {
      note(rel, i + 1, `lists phase ${numCell} as ${listed[0]}-${listed[1]} weeks but the phase file says "${actual.duration}"`);
    }
  });
  if (!sawPhaseRow) note(rel, 1, 'has no phase timeline table to cross-check');
}

// Report.
findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
for (const f of findings) console.log(`${f.file}:${f.line}: ${f.message}`);
console.log('');
console.log(`phases checked: ${phases.length}`);
console.log(`findings: ${findings.length}`);
if (findings.length === 0) {
  console.log('All time budgets agree with their own parts, their frontmatter, and their track overview.');
}
process.exit(findings.length === 0 ? 0 : 1);