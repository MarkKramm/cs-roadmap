// Audit the generated JSON for inline Markdown syntax that the site renders
// literally, because learning-site has no Markdown renderer.
// Reports counts per phase per field so the fix can be scoped accurately.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const PATTERNS = {
  bold: /\*\*[^*\n]+\*\*/g,
  italicStar: /(?<!\*)\*(?!\*)[^*\n]+\*(?!\*)/g,
  italicUnderscore: /(?<![_\w])_(?!_)[^_\n]+_(?![_\w])/g,
  code: /`[^`\n]+`/g,
  link: /\[[^\]\n]+\]\([^)\n]+\)/g,
  strikethrough: /~~[^~\n]+~~/g,
};

for (const track of ['it', 'cyber']) {
  const j = require(`../learning-site/src/data/generated/${track}.json`);
  const totals = {};
  const perPhase = new Map();

  const visit = (node, field) => {
    if (typeof node === 'string') {
      for (const [name, re] of Object.entries(PATTERNS)) {
        const m = node.match(re);
        if (m) {
          totals[name] = (totals[name] || 0) + m.length;
          const key = `${field}`;
          if (!perPhase.has(key)) perPhase.set(key, {});
          const f = perPhase.get(key);
          f[name] = (f[name] || 0) + m.length;
        }
      }
      return;
    }
    if (Array.isArray(node)) {
      node.forEach((v) => visit(v, field));
      return;
    }
    if (node && typeof node === 'object') {
      for (const [k, v] of Object.entries(node)) visit(v, k);
    }
  };

  visit(j, 'root');

  console.log(`\n=== ${track.toUpperCase()} track ===`);
  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) {
    console.log('  clean - no inline Markdown in rendered strings');
  } else {
    for (const [k, v] of entries) console.log(`  ${k.padEnd(18)} ${v}`);
  }

  const fields = [...perPhase.entries()].sort(
    (a, b) => Object.values(b[1]).reduce((x, y) => x + y, 0) - Object.values(a[1]).reduce((x, y) => x + y, 0),
  );
  console.log('  -- by field --');
  for (const [f, counts] of fields.slice(0, 12)) {
    const sum = Object.values(counts).reduce((x, y) => x + y, 0);
    console.log(`    ${f.padEnd(22)} ${sum}  (${Object.entries(counts).map(([k, v]) => `${k}:${v}`).join(', ')})`);
  }
}