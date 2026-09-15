#!/usr/bin/env node
// Acronym audit: which shortened forms reach the reader before anything tells
// them what the letters stand for.
//
// Deliberately a *measurement* first, and it exits 0. The failure mode of a
// term guard is a wall of false positives that trains everyone to ignore it,
// so this prints the population and the candidates before anything is allowed
// to fail a build. Read-only: writes nothing.
//
// Usage: node scripts/audit-terms.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.join(HERE, '..');
const BT = String.fromCharCode(96);
const FENCE = BT + BT + BT;

// Curriculum order. The reader starts at IT 01 and works forward into cyber,
// so a term expanded in cyber 02 is *not* available to a reader in cyber 05 —
// but it is available to someone reading IT 01 in order.
const TRACKS = ['it-roadmap', 'cybersec-roadmap'];

function collect() {
  const files = [];
  for (const track of TRACKS) {
    const dir = path.join(REPO, 'career-roadmaps', track);
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir).sort()) {
      if (!/^\d\d-phase-.*\.md$/.test(name)) continue;
      files.push({ key: `${track}/${name}`, file: path.join(dir, name) });
    }
  }
  const sharedDir = path.join(REPO, 'career-roadmaps', 'shared');
  if (fs.existsSync(sharedDir)) {
    for (const name of fs.readdirSync(sharedDir).sort()) {
      if (!name.endsWith('.md')) continue;
      files.push({ key: `shared/${name}`, file: path.join(sharedDir, name) });
    }
  }
  return files;
}

// Blank out fenced blocks and inline code spans while preserving line count, so
// a line number from the stripped text still points at the real line. Commands
// and config carry a lot of all-caps tokens (GET, POST, PID, CPU) that are not
// acronyms in prose and would drown the report.
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

const ACRONYM = /\b[A-Z][A-Z0-9]{1,5}\b/g;
const ROMAN = /^[IVXLCM]+$/;

// Three classes, kept explicit and separate. Collapsing them into one denylist
// is how a term guard quietly stops reporting anything — the first run of this
// script reported 365 "never expanded" forms, of which the large majority were
// one of the two classes below rather than a term a reader cannot decode.

// A beginner either arrives knowing these, or they are defined by the sentence
// around them without needing parentheses. Reported as ASSUMED, not as a
// finding, so the judgement stays visible and auditable.
const UNIVERSAL = new Set([
  'PC', 'IT', 'OS', 'CPU', 'RAM', 'USB', 'HDD', 'SSD', 'GPU', 'BIOS', 'UEFI',
  'ISO', 'LED', 'LCD', 'AC', 'DC', 'IP', 'DNS', 'URL', 'HTTP', 'HTTPS', 'API',
  'PDF', 'HTML', 'CSS', 'JSON', 'XML', 'GUI', 'CLI', 'LAN', 'WAN', 'VPN', 'VM',
  'RDP', 'SSH', 'FTP', 'SMTP', 'TCP', 'UDP', 'MAC', 'NIC', 'RAID', 'SATA',
  'NVME', 'DHCP', 'UPS', 'GB', 'MB', 'KB', 'TB', 'PB', 'GHZ', 'MHZ', 'KHZ',
  'US', 'UK', 'PH', 'OK', 'FAQ', 'DIY', 'CEO', 'CTO', 'HR', 'SLA', 'KPI',
  'ID', 'OTP', 'MFA', '2FA', 'AD', 'AV', 'EDR', 'SIEM', 'SOC', 'CVE', 'CVSS',
]);

// English words that appear in caps as a heading, a table cell or emphasis.
// These are not initialisms at all and were the bulk of the false positives.
const ENGLISH_CAPS = new Set([
  'MOST', 'BEST', 'ALL', 'NEW', 'USE', 'NOT', 'AND', 'THE', 'FOR', 'YOU',
  'CAN', 'ANY', 'ONE', 'TWO', 'HOW', 'WHY', 'WHAT', 'WHEN', 'WHERE', 'WHO',
  'YES', 'NO', 'ON', 'OFF', 'IN', 'OUT', 'UP', 'DOWN', 'DO', 'STOP', 'GO',
  'NOW', 'FIRST', 'LAST', 'NEXT', 'ONLY', 'SAME', 'EACH', 'BOTH', 'GOOD',
  'BAD', 'EASY', 'HARD', 'NOTE', 'WARNING', 'TIP', 'EXAMPLE', 'BUT', 'IF',
  'THEN', 'ELSE', 'END', 'TOP', 'TRY', 'RUN', 'SET', 'GET', 'PUT', 'POST',
  'DELETE', 'PATCH', 'HEAD', 'OPTIONS', 'TRACE', 'HOST', 'USER', 'PASS',
  'FILE', 'DIR', 'NG', 'AUTH', 'DET', 'TLD', 'RST', 'POP', 'CRM', 'IBM',
  'PHP', 'YAML', 'IIS', 'DLL', 'SUID', 'MOST', 'BEST',
]);

function makeLineIndex(text) {
  const starts = [0];
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '\n') starts.push(i + 1);
  }
  return starts;
}

function lineOf(starts, idx) {
  let lo = 0;
  let hi = starts.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (starts[mid] <= idx) lo = mid;
    else hi = mid - 1;
  }
  return lo + 1;
}

// Which of the three classes a form belongs to. Only DOMAIN is a candidate
// finding; the other two are reported so the classification can be challenged.
function classify(acr) {
  if (UNIVERSAL.has(acr)) return 'assumed';
  if (ENGLISH_CAPS.has(acr)) return 'not-an-initialism';
  return 'domain';
}

// escapeRe is used to build the expansion regexes below, where the acronym is
// interpolated into the pattern and a bare "C++" or "A+" would otherwise break
// the match or be read as a quantifier.
function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Is the acronym explained in the sentence it appears in? The window is the
// whole line, because a definition legitimately sits a clause away —
// "**NOC monitoring** — a NOC is a Network Operations Centre" — and a 120
// character window missed that shape and 14 others like it.
//
// Accepted shapes, all of which explain the term to a reader encountering it:
//   Random Access Memory (RAM)          expansion then short form
//   RAM (Random Access Memory)          short form then expansion
//   MSP is a managed service provider   "X is a ..." definition
//   NOC — a Network Operations Centre   dash apposition
//   ISACA's CISA (audit)                expansion in parentheses, singular
function expandedAt(text, idx, acr) {
  const lineStart = text.lastIndexOf('\n', idx - 1) + 1;
  const lineEnd = text.indexOf('\n', idx);
  const line = text.slice(lineStart, lineEnd === -1 ? text.length : lineEnd);

  const parenAfter = new RegExp(
    escapeRe(acr) + 's?\\s*\\([A-Za-z][A-Za-z0-9 -]{3,}\\)',
  );
  if (parenAfter.test(line)) return true;

  const parenBefore = new RegExp(
    '[A-Z][A-Za-z0-9-]*(?:\\s+[A-Za-z0-9][A-Za-z0-9-]*){1,5}\\s*\\(\\s*' +
      escapeRe(acr) +
      's?\\s*\\)',
  );
  if (parenBefore.test(line)) return true;

  const isA = new RegExp(escapeRe(acr) + 's?\\s+is\\s+(?:an?|the)\\s+[A-Z]');
  if (isA.test(line)) return true;

  const apposition = new RegExp(escapeRe(acr) + 's?\\s+[—–-]\\s+[A-Z]');
  if (apposition.test(line)) return true;

  return false;
}

const files = collect();
const records = []; // one entry per (file, acronym) at its first use in that file
let distinctTotal = 0;

for (const { key, file } of files) {
  const raw = fs.readFileSync(file, 'utf8');
  const lines = stripCode(raw);
  const text = lines.join('\n');
  const starts = makeLineIndex(text);

  // Exclude the syllabus sections. "Specific topics to learn" and
  // "Common ports:" are tables of contents — they legitimately name a term the
  // reader has not met yet, because meeting it is the point of the phase. Every
  // first run of this script flagged them, which is a scoping bug rather than a
  // comprehension defect. The region runs from the heading to the next h2.
  const rawLines = lines;
  const isSyllabus = new Array(rawLines.length).fill(false);
  let inSyllabus = false;
  for (let i = 0; i < rawLines.length; i++) {
    if (/^##\s/.test(rawLines[i])) {
      inSyllabus = /^##\s+(Specific topics to learn|What to learn|Topics)\b/i.test(
        rawLines[i],
      );
    }
    isSyllabus[i] = inSyllabus;
  }

  const firstHere = new Map();
  ACRONYM.lastIndex = 0;
  let m;
  while ((m = ACRONYM.exec(text)) !== null) {
    const acr = m[0];
    if (ROMAN.test(acr)) continue;
    // MITRE ATT&CK technique ids (T1053) and cloud resource concatenations
    // (AWSEC2) are identifiers, not initialisms. A reader is never expected to
    // "know" them, and they drown the report.
    if (/[0-9]/.test(acr)) continue;
    const atLine = lineOf(starts, m.index);
    if (isSyllabus[atLine - 1]) continue;
    if (!firstHere.has(acr)) firstHere.set(acr, { idx: m.index, cls: classify(acr) });
  }

  distinctTotal += firstHere.size;
  for (const [acr, info] of firstHere) {
    const line = lineOf(starts, info.idx);
    records.push({
      key,
      acr,
      line,
      cls: info.cls,
      expanded: expandedAt(text, info.idx, acr),
      context: (lines[line - 1] || '').trim().slice(0, 110),
    });
  }
}

// Walk the records in curriculum order. The first time an acronym is ever seen
// is its first use; if it is not expanded there, that is a finding.
const firstSeen = new Map();
const findings = [];
for (const rec of records) {
  if (firstSeen.has(rec.acr)) continue;
  firstSeen.set(rec.acr, rec);
  if (!rec.expanded) findings.push(rec);
}

const expandedSomewhere = new Set(
  records.filter((r) => r.expanded).map((r) => r.acr),
);

const expandedLater = [];
const neverExpanded = [];
for (const rec of findings) {
  if (expandedSomewhere.has(rec.acr)) expandedLater.push(rec);
  else neverExpanded.push(rec);
}

// Soft measure: acronyms used in a phase but never explained anywhere in that
// same phase. The phase is a sitting, not a library, so this is the number a
// reader actually experiences — but it is informational, not a finding.
const perPhase = [];
for (const { key } of files) {
  const inFile = records.filter((r) => r.key === key);
  const explained = new Set(inFile.filter((r) => r.expanded).map((r) => r.acr));
  const unexplained = inFile.filter((r) => !explained.has(r.acr)).map((r) => r.acr);
  if (unexplained.length) perPhase.push({ key, count: unexplained.length });
}

function show(list) {
  for (const rec of list) {
    process.stdout.write(`  ${rec.key}:${rec.line}  ${rec.acr}\n`);
    process.stdout.write(`      ${rec.context}\n`);
  }
}

const byClass = (list, cls) => list.filter((r) => r.cls === cls);
const DOMAIN = byClass(neverExpanded, 'domain');
const ASSUMED = byClass(neverExpanded, 'assumed');
const NOT_INIT = byClass(neverExpanded, 'not-an-initialism');

process.stdout.write('ACRONYM AUDIT — measurement, not a gate\n\n');
process.stdout.write(`files scanned: ${files.length}\n`);
process.stdout.write(`distinct shortened forms: ${distinctTotal}\n`);
process.stdout.write(`  expanded at first use: ${distinctTotal - findings.length}\n`);
process.stdout.write(`  first used before any expansion: ${findings.length}\n`);
process.stdout.write(`    expanded somewhere later: ${expandedLater.length}\n`);
process.stdout.write(`    never expanded anywhere: ${neverExpanded.length}\n`);
process.stdout.write(`      of which domain terms: ${DOMAIN.length}\n`);
process.stdout.write(`      of which assumed-known: ${ASSUMED.length}\n`);
process.stdout.write(`      of which not initialisms: ${NOT_INIT.length}\n\n`);

process.stdout.write(
  `DOMAIN TERMS NEVER EXPANDED (${DOMAIN.length}) — these are the candidate findings\n`,
);
show(DOMAIN);

process.stdout.write(
  `\nUSED BEFORE THE EXPANSION APPEARS (${expandedLater.length})\n`,
);
show(expandedLater);

process.stdout.write(
  `\nASSUMED KNOWN, not reported (${ASSUMED.length}): ` +
    `${ASSUMED.map((r) => r.acr).sort().join(', ')}\n`,
);
process.stdout.write(
  `\nNOT INITIALISMS, not reported (${NOT_INIT.length}): ` +
    `${NOT_INIT.map((r) => r.acr).sort().join(', ')}\n`,
);

process.stdout.write(`\nPHASES BY UNEXPLAINED DOMAIN TERMS\n`);
const perPhaseDomain = [];
for (const { key } of files) {
  const n = DOMAIN.filter((r) => r.key === key).length;
  if (n) perPhaseDomain.push({ key, n });
}
perPhaseDomain
  .sort((a, b) => b.n - a.n)
  .forEach((p) => process.stdout.write(`  ${String(p.n).padStart(4)}  ${p.key}\n`));

// A stricter tier, to test whether the domain list can be made actionable at
// all. Two filters, both chosen because they correlate with "load-bearing term
// the reader must decode" rather than "string that happens to be capitalised":
//   - at least three characters, which drops RR, AM, PM, HD, HP, CR, NS, DS
//   - used in two or more files, which drops one-off brand names and labels
const fileCount = new Map();
for (const r of records) fileCount.set(r.acr, (fileCount.get(r.acr) || 0) + 1);

const ACTIONABLE = DOMAIN.filter(
  (r) => r.acr.length >= 3 && (fileCount.get(r.acr) || 0) >= 2,
);

process.stdout.write(
  `\nACTIONABLE TIER — domain, never expanded, >=3 chars, in >=2 files (${ACTIONABLE.length})\n`,
);
show(ACTIONABLE);