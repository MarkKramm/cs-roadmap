// Controls for audit-changelog.mjs. Every class must be provably able to FAIL.
// A guard whose pass path looks like its skip path is not a guard (D-033), so
// each fixture below is a real defect the check must report, plus one clean
// fixture it must not.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const SCRIPT = 'scripts/audit-changelog.mjs';
const backup = fs.readFileSync('CHANGELOG.md', 'utf8');

const run = () => {
  try {
    const out = execFileSync(process.execPath, [SCRIPT], { encoding: 'utf8' });
    return { code: 0, out };
  } catch (e) {
    return { code: e.status ?? 1, out: (e.stdout ?? '') + (e.stderr ?? '') };
  }
};

let pass = 0;
let fail = 0;
const check = (name, ok, detail) => {
  if (ok) {
    pass++;
    console.log(`  OK  ${name}`);
  } else {
    fail++;
    console.log(`  FAIL ${name}${detail ? ` — ${detail}` : ''}`);
  }
};

const withChangelog = (content) => {
  fs.writeFileSync('CHANGELOG.md', content, 'utf8');
  return run();
};

const base = `# Changelog

## [Unreleased]

### Added

- Something new.

## [0.1.0] — 2026-01-01

### Added

- Baseline.
`;

try {
  console.log('audit-changelog controls\n');

  // --- The clean fixture must PASS. This is the control that stops the guard
  // from being one that simply always fails.
  let r = withChangelog(base);
  check('clean changelog exits 0', r.code === 0, `exit ${r.code}`);
  check('clean changelog reports no findings', /findings: 0/.test(r.out), r.out.trim());

  // --- Class 1: duplicate section heading.
  r = withChangelog(base.replace('- Something new.', '- One.\n\n### Added\n\n- Two.'));
  check('duplicate `### Added` exits 1', r.code === 1, `exit ${r.code}`);
  check('duplicate is named as a second heading', /second `### Added`/.test(r.out), r.out.trim());

  // --- Class 2: canonical order violated (Fixed before Added).
  r = withChangelog(`# Changelog

## [Unreleased]

### Fixed

- A fix.

### Added

- A feature.
`);
  check('out-of-order sections exit 1', r.code === 1, `exit ${r.code}`);
  check('order violation names both headings', /lists `### Added` after `### Fixed`/.test(r.out), r.out.trim());

  // --- Class 3a: heading with no content.
  r = withChangelog(`# Changelog

## [Unreleased]

### Added

### Fixed

- Real entry.
`);
  check('empty heading exits 1', r.code === 1, `exit ${r.code}`);
  check('empty heading is reported', /has no entries/.test(r.out), r.out.trim());

  // --- Class 3b: version block with nothing at all.
  r = withChangelog(`# Changelog

## [Unreleased]
`);
  check('empty version block exits 1', r.code === 1, `exit ${r.code}`);
  check('empty block is reported', /no sections and no content/.test(r.out), r.out.trim());

  // --- Must NOT fire: a version block that legitimately omits `Security`, and
  // headings in canonical order with content.
  r = withChangelog(`# Changelog

## [Unreleased]

### Added

- A.

### Changed

- B.

### Fixed

- C.

## [0.2.0] — 2026-01-01

### Fixed

- Only this section is present, which is allowed.
`);
  check('omitting unused sections is allowed', r.code === 0, r.out.trim());
  check('a single non-Added section is allowed', /findings: 0/.test(r.out), r.out.trim());

  // --- Must NOT fire: prose directly under a version heading, no sections.
  r = withChangelog(`# Changelog

## [Unreleased]

Nothing shipped this cycle.
`);
  check('a release note without sections is allowed', r.code === 0, r.out.trim());
} finally {
  fs.writeFileSync('CHANGELOG.md', backup, 'utf8');
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
