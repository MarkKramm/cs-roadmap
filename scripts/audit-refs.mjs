// Cross-reference audit. Exit code 1 on a broken reference, so it can gate CI.
//
// This exists because a comprehension audit of all 23 phases found a class of
// defect that no existing guard could see: text that sends the reader to a
// section that does not exist, or names an earlier phase as the source of
// something that phase never taught.
//
//   IT 06 told the reader to write "the escalation note from Part 5's structure".
//     The structure is in Part 4. Part 5 has no escalation structure at all.
//   IT 07 said "Part 8 gave you reps". Phase 07 ends at Part 7.
//   Cyber 09's "What you already have" table cited Phase 10 and Phase 11, both
//     of which come after Phase 09 in the sequence.
//
// All three are arithmetic on the text, not judgement about the reader, so a
// script can hold the line. That is the whole test for whether a class belongs
// in a guard rather than in a periodic human read — the acronym experiment in
// docs/COMPREHENSION-AUDIT.md is the counter-example, and stays a measurement.
//
// Read-only: writes nothing.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'career-roadmaps';
const TRACKS = ['it-roadmap', 'cybersec-roadmap'];
const BT = String.fromCharCode(96);
const FENCE = BT + BT + BT;

// Remove fenced blocks and inline code spans, preserving line count so every
// reported line number still points at the real file. A shell comment that
// happens to contain "part 2" is not a reference to a lesson section.
function stripCode(raw) {
  const out = [];
  let inFence = false;
  for (const line of raw.split('\n')) {
    const t = line.trimStart();
    if (t.startsWith(FENCE)) {
      inFence = !inFence;
      out.push('');
      continue;
    }
    if (inFence) {
      out.push('');
      continue;
    }
    out.push(line.replace(/`[^`]*`/g, (m) => ' '.repeat(m.length)));
  }
  return out;
}

function collect() {
  const files = [];
  for (const track of TRACKS) {
    const dir = path.join(ROOT, track);
    for (const f of fs.readdirSync(dir).sort()) {
      if (!/^\d{2}-.*\.md$/.test(f)) continue;
      files.push({ track, name: f, file: path.join(dir, f) });
    }
  }
  return files;
}

const files = collect();
const findings = [];

// The set of phase numbers that exist in each track, so a "Phase 12" in a track
// with only 9 phases is a finding rather than a guess.
const phasesInTrack = new Map();
for (const { track, name } of files) {
  if (!phasesInTrack.has(track)) phasesInTrack.set(track, new Set());
  phasesInTrack.get(track).add(Number(name.slice(0, 2)));
}

// Words that mark a reference as being about *prior* learning. Kept tight on
// purpose: an early version included the bare word "from" and "and", which
// matched "Risk reasoning from Phase 13 arrives later" — a sentence that
// explicitly flags the phase as coming later, i.e. the opposite of the defect.
// The class is informational for that reason; only an exact name that does not
// exist can fail a build.
const PRIOR_CUE =
  /(?:defined|taught|covered|learned|learnt|introduced|explained|gave you|you (?:already )?(?:have|built|did)|you (?:saw|did)|covered in|taught in|from your)\s+Phase/;

for (const { track, name, file } of files) {
  const raw = fs.readFileSync(file, 'utf8');
  const lines = stripCode(raw);
  const current = Number(name.slice(0, 2));

  // --- Part references, resolved against this file's own headings ---
  const partHeadings = new Set();
  for (const line of lines) {
    const m = line.match(/^###\s+Part\s+(\d+)\b/);
    if (m) partHeadings.add(Number(m[1]));
  }

  // Part headings per phase file, so a reference qualified by another phase —
  // "Phase 3's Part 4" — is resolved against that phase and not against the
  // file it happens to be written in. The first run of this guard reported
  // exactly that as a defect, which was the guard being wrong rather than the
  // prose.
  const partHeadingsByPhase = new Map();
  for (const other of files) {
    if (other.track !== track) continue;
    const otherLines = stripCode(fs.readFileSync(other.file, 'utf8'));
    const set = new Set();
    for (const l of otherLines) {
      const m = l.match(/^###\s+Part\s+(\d+)\b/);
      if (m) set.add(Number(m[1]));
    }
    partHeadingsByPhase.set(Number(other.name.slice(0, 2)), set);
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^###\s+Part\s+\d+\b/.test(line)) continue; // the heading itself

    // Which phase's Parts does this line talk about? Default is this file.
    let scope = partHeadings;
    let scopeLabel = 'this file';
    const q = line.match(/Phase\s+(\d{1,2})'s\s+Part/);
    if (q) {
      const owner = Number(q[1]);
      if (partHeadingsByPhase.has(owner)) {
        scope = partHeadingsByPhase.get(owner);
        scopeLabel = `Phase ${owner}`;
      }
    }

    // A bare "Part N" only counts when the line is not qualified by another
    // phase at all — otherwise "Phase 3's Part 4" would also be read as a
    // reference to this file's Part 4.
    const isQualified = /Phase\s+\d{1,2}'s\s+Part/.test(line);

    const check = (n, why) => {
      if (!scope.has(n)) {
        findings.push({
          cls: 'PART_DOES_NOT_EXIST',
          where: `${name}:${i + 1}`,
          detail: `${why} Part ${n}; ${scopeLabel} has Parts ${[...scope].sort((a, b) => a - b).join(', ')}`,
          quote: line.trim().slice(0, 120),
        });
      }
    };

    const single = line.matchAll(/\bParts?\s+(\d+)(?!\s*(?:to|-|–)\s*\d+)\b/g);
    for (const m of single) {
      if (isQualified) continue;
      check(Number(m[1]), 'references');
    }
    const range = line.matchAll(/\bParts?\s+(\d+)\s*(?:to|-|–)\s*(\d+)\b/g);
    for (const m of range) {
      for (const n of [Number(m[1]), Number(m[2])]) check(n, 'range cites');
    }
  }

  // --- Phase references, resolved against the track ---
  const trackPhases = phasesInTrack.get(track);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const m of line.matchAll(/\bPhases?\s+(\d{1,2})\b/g)) {
      const n = Number(m[1]);
      if (!trackPhases.has(n)) {
        findings.push({
          cls: 'PHASE_DOES_NOT_EXIST',
          where: `${name}:${i + 1}`,
          detail: `references Phase ${n}; ${track} has ${[...trackPhases].sort((a, b) => a - b).join(', ')}`,
          quote: line.trim().slice(0, 120),
        });
        continue;
      }
      // A forward citation inside a prior-knowledge cue.
      if (n > current && PRIOR_CUE.test(line.slice(0, m.index + 4))) {
        findings.push({
          cls: 'FORWARD_AS_PRIOR',
          where: `${name}:${i + 1}`,
          detail: `Phase ${current} cites Phase ${n} as prior knowledge, but ${n} comes later`,
          quote: line.trim().slice(0, 120),
        });
      }
    }
  }
}

// --- Report ---
const byClass = {};
for (const f of findings) (byClass[f.cls] ||= []).push(f);

process.stdout.write('CROSS-REFERENCE AUDIT\n\n');
process.stdout.write(`files scanned: ${files.length}\n`);
process.stdout.write(`findings: ${findings.length}\n\n`);

for (const cls of Object.keys(byClass).sort()) {
  process.stdout.write(`${cls} (${byClass[cls].length})\n`);
  for (const f of byClass[cls]) {
    process.stdout.write(`  ${f.where}  ${f.detail}\n`);
    process.stdout.write(`      ${f.quote}\n`);
  }
  process.stdout.write('\n');
}

// Only the two exact classes gate. A name that does not exist is arithmetic on
// the text; "this sentence claims prior knowledge" is a judgement about
// intent, and the guard has already been wrong about it once. FORWARD_AS_PRIOR
// is printed for a human to read and does not fail the build — the same
// distinction docs/COMPREHENSION-AUDIT.md draws for the acronym scan.
const EXACT = ['PART_DOES_NOT_EXIST', 'PHASE_DOES_NOT_EXIST'];
const gating = findings.filter((f) => EXACT.includes(f.cls));

if (findings.length === 0) {
  process.stdout.write('All cross-references resolve.\n');
} else if (gating.length === 0) {
  process.stdout.write(
    `No broken names. ${findings.length} forward-as-prior observation(s) above are informational.\n`,
  );
}
process.exit(gating.length === 0 ? 0 : 1);