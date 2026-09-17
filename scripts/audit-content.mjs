// Full content audit across both tracks. Checks the defect classes found so far
// plus several that could plausibly exist, so the report is evidence rather than
// a guess. Read-only: writes nothing.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'career-roadmaps';
const BT = String.fromCharCode(96);
const FENCE = BT + BT + BT;

// Every track directory this audit walks. A new track is invisible to the script
// until it is named here, and the failure mode is the worst one this repository
// keeps recording: a clean report that simply never looked at the new files.
const TRACKS = ['it-roadmap', 'cybersec-roadmap', 'advance-roadmap'];

const files = [];
const skippedTracks = [];
for (const track of TRACKS) {
  const dir = path.join(ROOT, track);
  if (!fs.existsSync(dir)) { skippedTracks.push(track); continue; }
  for (const f of fs.readdirSync(dir).sort()) {
    // 00-overview is a strategy document, not a phase file, so the phase
    // structure requirements do not apply to it. Phases use two-digit numbers
    // starting at 01 (01 … 14); matching only 01–09 would skip every later
    // phase, while matching 00 would wrongly demand phase sections of the
    // overview.
    if (/^(?!00-)\d{2}-.*\.md$/.test(f)) files.push({ track, file: path.join(dir, f) });
  }
}

// Required sections. "Specific topics to learn" is deliberately NOT here: it is
// in build-content.mjs's OPTIONAL list, and several phases legitimately use a
// differently-named section instead ("Portfolio structure", "Lab setup
// options", "Target roles", "Path options", "Required projects",
// "Recommended order"). Flagging those would be a false positive.
const REQUIRED = [
  'Goal of this phase',
  'Estimated time',
  "Skills you'll gain",
  'Lesson',
  'Tools for This Phase',
  'Free/cheap resources',
  'Hands-on practice tasks',
  'Deliverable / proof of work',
  'Checklist',
  "You're ready to move on when",
  'Free vs Paid',
];

// At least ONE of these must be present — the phase's topic/structure section.
const TOPIC_SECTION_ANY = [
  'Specific topics to learn',
  'Lab setup options',
  'Path options',
  'Required projects',
  'Recommended order',
  'Target roles',
  'Portfolio structure',
];

const findings = {};

function add(cls, file, detail) {
  if (!findings[cls]) findings[cls] = [];
  findings[cls].push({ file, detail });
}

for (const { track, file } of files) {
  const raw = fs.readFileSync(file, 'utf8');
  const rel = file.replace(/\\/g, '/');
  const lines = raw.split('\n');

  // --- encoding ---
  const buf = fs.readFileSync(file);
  if (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) add('BOM', rel, 'file starts with U+FEFF');
  if (raw.includes('\r')) add('CRLF', rel, 'carriage return present');
  if (raw.includes('\ufffd')) add('REPLACEMENT_CHAR', rel, 'U+FFFD present');

  // --- required sections, in order ---
  const headings = [];
  let inFence = false;
  lines.forEach((line, i) => {
    if (line.trimStart().startsWith(FENCE)) { inFence = !inFence; return; }
    if (inFence) return;
    const m = /^(#{2,6}) (.+?)\s*$/.exec(line);
    if (m) headings.push({ level: m[1].length, text: m[2], line: i + 1 });
  });
  const h2 = headings.filter((h) => h.level === 2).map((h) => h.text);
  let lastIdx = -1;
  for (const req of REQUIRED) {
    const idx = h2.findIndex((t) => t.startsWith(req));
    if (idx === -1) add('MISSING_SECTION', rel, req);
    else if (idx < lastIdx) add('SECTION_ORDER', rel, `${req} appears out of order`);
    else lastIdx = idx;
  }

  // Exactly one topic/structure section must exist, under any of its known
  // names. Missing entirely means the phase lost its "what to learn" block.
  if (!TOPIC_SECTION_ANY.some((t) => h2.some((x) => x.startsWith(t)))) {
    add('MISSING_TOPIC_SECTION', rel, 'none of: ' + TOPIC_SECTION_ANY.join(', '));
  }

  // --- lesson present and substantial ---
  const lesson = headings.find((h) => h.text.startsWith('Lesson'));
  if (!lesson) add('NO_LESSON', rel, 'no ## Lesson section');
  else {
    const tools = headings.find((h, i) => h.level === 2 && h.text.startsWith('Tools for This Phase') && h.line > lesson.line);
    if (!tools) add('LESSON_UNTERMINATED', rel, 'no ## Tools after lesson');
    else {
      const body = lines.slice(lesson.line, tools.line - 1).join(' ');
      const words = body.split(/\s+/).filter(Boolean).length;
      if (words < 3000) add('LESSON_TOO_SHORT', rel, `${words} words`);
    }
  }

  // --- closing sections inside the lesson, not after it ---
  // h.text has the leading hashes stripped, so these patterns must not include
  // them. (Getting this wrong silently reported every file as missing its
  // closing sections.)
  const kt = headings.find((h) => h.level === 3 && /^(Part \d+ — )?Key takeaways$/.test(h.text));
  const pt = headings.find((h) => h.level === 3 && /^(Part \d+ — )?Practice this next$/.test(h.text));
  if (!kt) add('NO_KEY_TAKEAWAYS', rel, 'missing ### Key takeaways');
  if (!pt) add('NO_PRACTICE', rel, 'missing ### Practice this next');
  if (kt && pt && pt.line < kt.line) add('CLOSING_ORDER', rel, 'Practice before Key takeaways');

  // --- content stranded AFTER the closing sections (the Phase 1/6/7/8 defect) ---
  // The closing pair is the LAST thing in the phase file. Anything between
  // "Practice this next" and the next ## section is stranded: it is inside the
  // Lesson region but after the lesson has effectively ended, so it reads as an
  // appendix to the takeaways rather than as part of the lesson.
  //
  // NOTE: ## Tools comes BEFORE the closing sections, so bounding by tools.line
  // produced an empty range and the check never fired. Bound by the next ##
  // heading after "Practice this next" instead.
  if (pt) {
    const after = headings.find((h) => h.level === 2 && h.line > pt.line);
    const limit = after ? after.line : Number.MAX_SAFE_INTEGER;
    const stranded = headings.filter(
      (h) => h.line > pt.line && h.line < limit && h.level >= 3
        && !/^(Part \d+ — )?(Key takeaways|Practice this next)$/.test(h.text),
    );
    for (const s of stranded) add('STRANDED_AFTER_CLOSING', rel, `line ${s.line}: ${s.text}`);
  }

  // --- glued headings (fence-aware) ---
  inFence = false;
  lines.forEach((line, i) => {
    if (line.trimStart().startsWith(FENCE)) { inFence = !inFence; return; }
    if (inFence) return;
    if (/^#{2,6} /.test(line) && i > 0 && lines[i - 1].trim() !== '' && !/^#{1,6} /.test(lines[i - 1])) {
      add('GLUED_HEADING', rel, `line ${i + 1}: ${line}`);
    }
  });

  // --- unbalanced code fences ---
  let fences = 0;
  lines.forEach((l) => { if (l.trimStart().startsWith(FENCE)) fences++; });
  if (fences % 2 !== 0) add('UNBALANCED_FENCE', rel, `${fences} fence lines (odd)`);

  // --- blank line before every fence ---
  // An INDENTED fence sits inside a list item, which is valid Markdown and does
  // not need a blank line before it. Only an unindented (column-0) fence does.
  inFence = false;
  lines.forEach((line, i) => {
    const isF = line.trimStart().startsWith(FENCE);
    const atColumnZero = line.startsWith(FENCE);
    if (isF && !inFence && atColumnZero && i > 0 && lines[i - 1].trim() !== '') {
      add('GLUED_FENCE', rel, `line ${i + 1}: unindented fence opens without a preceding blank line`);
    }
    if (isF) inFence = !inFence;
  });

  // --- duplicate part numbers ---
  // `headings[].text` has its `#` prefix stripped at collection time (see the
  // heading regex above), so these patterns must NOT include the `### ` marker.
  // They did until 2026-09-17, which meant both DUPLICATE_PART and PART_GAP
  // filtered an empty array and could never fire — a rule that printed nothing
  // and was read as green, exactly the failure class this file's sibling guards
  // each record once. Found by mutation-testing this guard: planting a genuine
  // duplicate `### Part 1` heading exited 0.
  const parts = headings.filter((h) => /^Part \d+/.test(h.text)).map((h) => h.text.match(/^Part (\d+)/)[1]);
  const seen = new Set();
  for (const p of parts) {
    if (seen.has(p)) add('DUPLICATE_PART', rel, `Part ${p} appears more than once`);
    seen.add(p);
  }
  // parts should be 1..n with no gaps
  const nums = [...seen].map(Number).sort((a, b) => a - b);
  nums.forEach((n, i) => { if (n !== i + 1) add('PART_GAP', rel, `expected Part ${i + 1}, found ${n}`); });

  // --- placeholder markers ---
  // "PLACEHOLDER" is a risky word to match, because legitimate prose uses it
  // ("a placeholder value in the config"). Only flag the unmistakable markers,
  // and only as a standalone token in a comment-like position.
  lines.forEach((line, i) => {
    if (/\b(TODO:|FIXME:|XXX:|Lorem ipsum dolor)\b/i.test(line)) {
      add('PLACEHOLDER', rel, `line ${i + 1}: ${line.trim().slice(0, 90)}`);
    }
  });

  // --- empty sections (heading immediately followed by another heading) ---
  headings.forEach((h, i) => {
    const next = headings[i + 1];
    if (next && next.line === h.line + 1) add('EMPTY_SECTION', rel, `line ${h.line}: ${h.text}`);
  });
}

// ---------- report ----------
console.log('AUDIT: ' + files.length + ' phase files scanned');
// A track that could not be read is named, so the count above is never mistaken
// for full coverage of every declared track.
if (skippedTracks.length) console.log('  (no directory yet, skipped: ' + skippedTracks.join(', ') + ')');
console.log('');
const order = [
  'BOM', 'CRLF', 'REPLACEMENT_CHAR', 'MISSING_SECTION', 'MISSING_TOPIC_SECTION',
  'SECTION_ORDER', 'NO_LESSON', 'LESSON_TOO_SHORT', 'LESSON_UNTERMINATED',
  'NO_KEY_TAKEAWAYS', 'NO_PRACTICE', 'CLOSING_ORDER', 'STRANDED_AFTER_CLOSING',
  'GLUED_HEADING', 'GLUED_FENCE', 'UNBALANCED_FENCE', 'DUPLICATE_PART',
  'PART_GAP', 'EMPTY_SECTION', 'PLACEHOLDER',
];

// Any class recorded by a check but missing from `order` would be counted as
// zero and silently dropped, so the exit code would say "clean" while the
// report showed nothing. Fail loudly instead of hiding findings.
const unreported = Object.keys(findings).filter((c) => !order.includes(c));
if (unreported.length > 0) {
  console.error('AUDIT SCRIPT ERROR — these checks are not in the report list: ' + unreported.join(', '));
  process.exit(2);
}

let total = 0;
for (const cls of order) {
  const hits = findings[cls];
  if (!hits) { console.log(`  OK    ${cls}`); continue; }
  total += hits.length;
  console.log(`  ISSUE ${cls} — ${hits.length}`);
  hits.slice(0, 8).forEach((h) => console.log(`          ${h.file}\n            ${h.detail}`));
  if (hits.length > 8) console.log(`          ... and ${hits.length - 8} more`);
}
console.log(`\nTOTAL ISSUES: ${total}`);

// Exit non-zero when anything was found, so CI fails rather than printing a
// report nobody reads.
if (total > 0) {
  console.error('\nCONTENT AUDIT FAILED — see the issues above.');
  process.exit(1);
}
console.log('CONTENT AUDIT PASSED — phase structure is intact.');