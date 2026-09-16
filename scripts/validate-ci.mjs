// Validate .github/workflows/ci.yml structurally: every step has a name and
// exactly one of `run`/`uses`, indentation is even, no tabs, and every script
// named in a `run:` step actually exists in the repository. Written because no
// YAML parser is vendored and a broken workflow is invisible locally — CI would
// simply fail to start, which reads as "no CI" rather than "broken CI".
import fs from 'node:fs';

const FILE = '.github/workflows/ci.yml';
const lines = fs.readFileSync(FILE, 'utf8').split('\n');

let fail = 0;
const bad = (line, msg) => {
  fail++;
  console.log(`  FAIL ${FILE}:${line} ${msg}`);
};

// Tabs are illegal in YAML indentation.
lines.forEach((l, i) => {
  if (/\t/.test(l)) bad(i + 1, 'contains a tab (illegal in YAML indentation)');
});

// Walk the steps of each job: record `- name:`, then the block that follows.
const steps = [];
let job = null;
let cur = null;
lines.forEach((l, i) => {
  const jobM = l.match(/^  ([A-Za-z0-9_-]+):\s*$/);
  if (jobM) {
    job = jobM[1];
    cur = null;
    return;
  }
  const nameM = l.match(/^      - name:\s*(.+?)\s*$/);
  if (nameM) {
    cur = { job, name: nameM[1], line: i + 1, hasRun: false, hasUses: false, run: [] };
    steps.push(cur);
    return;
  }
  if (!cur) return;
  if (/^        uses:/.test(l)) cur.hasUses = true;
  const runM = l.match(/^        run:\s*(.*)$/);
  if (runM) {
    cur.hasRun = true;
    if (runM[1].trim() && runM[1].trim() !== '|' && runM[1].trim() !== '>') cur.run.push(runM[1].trim());
    return;
  }
  // continuation lines of a block scalar run
  if (/^          /.test(l) && cur.hasRun && l.trim()) cur.run.push(l.trim());
});

console.log(`steps found: ${steps.length}`);

for (const s of steps) {
  if (s.hasRun === s.hasUses) {
    bad(s.line, `step "${s.name}" has ${s.hasRun ? 'both run and uses' : 'neither run nor uses'}`);
  }
  if (!s.name.trim()) bad(s.line, 'step has an empty name');
}

// Every `node scripts/...` and `npm run ...` referenced must resolve.
const scriptRefs = new Set();
for (const s of steps) {
  for (const cmd of s.run) {
    for (const m of cmd.matchAll(/node\s+(scripts\/[\w.-]+\.mjs)/g)) scriptRefs.add(m[1]);
  }
}
const missing = [...scriptRefs].filter((p) => !fs.existsSync(p));
if (missing.length) for (const p of missing) bad(0, `references ${p}, which does not exist`);
console.log(`distinct scripts referenced: ${scriptRefs.size}`);
for (const p of [...scriptRefs].sort()) console.log(`  ${fs.existsSync(p) ? 'ok  ' : 'MISS'} ${p}`);

// package.json scripts referenced by `npm run X`. There is no root package.json
// in this repository — every npm script lives in learning-site/ — so a missing
// root file is expected, not a failure. Both are read when present.
const readScripts = (p) => {
  if (!fs.existsSync(p)) return [];
  return Object.keys(JSON.parse(fs.readFileSync(p, 'utf8')).scripts ?? {});
};
const known = new Set([...readScripts('package.json'), ...readScripts('learning-site/package.json')]);
const npmRefs = new Set();
for (const s of steps) for (const cmd of s.run) for (const m of cmd.matchAll(/npm run ([\w:-]+)/g)) npmRefs.add(m[1]);
console.log(`distinct npm scripts referenced: ${npmRefs.size}`);
for (const n of [...npmRefs].sort()) {
  const ok = known.has(n);
  if (!ok) bad(0, `references npm script "${n}", which no package.json defines`);
  console.log(`  ${ok ? 'ok  ' : 'MISS'} npm run ${n}`);
}

console.log('');
if (fail === 0) console.log('CI workflow structure is sound: every step well-formed, every referenced script exists.');
else console.log(`${fail} problem(s) found.`);
process.exit(fail === 0 ? 0 : 1);
