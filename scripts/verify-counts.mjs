// Compare current generated IT counts against a saved baseline.
// Usage: node scripts/verify-counts.mjs <baseline.json>
// Exits non-zero if any phase's counts changed, so it can gate a commit.
import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const baselinePath = process.argv[2];
if (!baselinePath) {
  console.error('usage: node scripts/verify-counts.mjs <baseline.json>');
  process.exit(2);
}

const current = require('../learning-site/src/data/generated/it.json');
const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));

const shape = (j) =>
  Object.fromEntries(
    j.phases.map((p) => [
      p.id,
      {
        tasks: (p.tasks || []).length,
        checklist: (p.checklist || []).length,
        tools: (p.tools || []).length,
        resources: (p.resources || []).length,
      },
    ]),
  );

const a = shape(baseline);
const b = shape(current);

let changed = 0;
for (const id of Object.keys(a)) {
  if (!(id in b)) {
    console.log(`MISSING now: ${id}`);
    changed++;
    continue;
  }
  const x = JSON.stringify(a[id]);
  const y = JSON.stringify(b[id]);
  if (x !== y) {
    console.log(`CHANGED ${id}`);
    console.log(`   before ${x}`);
    console.log(`   after  ${y}`);
    changed++;
  }
}
for (const id of Object.keys(b)) {
  if (!(id in a)) {
    console.log(`NEW phase: ${id}`);
    changed++;
  }
}

const total = current.phases.reduce((n, p) => n + (p.tasks || []).length, 0);
console.log(`total task IDs: ${total}`);

if (changed === 0) {
  console.log('VERIFY OK - all phase counts identical to baseline');
} else {
  console.log(`VERIFY FAILED - ${changed} phase(s) differ`);
  process.exit(1);
}