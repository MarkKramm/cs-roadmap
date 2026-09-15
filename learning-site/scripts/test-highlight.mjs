// Query highlighting for search snippets.
//
// The matching rules are the risky part of the feature: a bad pattern either
// throws on a term like "c++" or silently marks the wrong span, and neither
// failure is visible until a reader sees the wrong word underlined. A search
// that returns the right result with the wrong word marked looks broken, so
// this asserts on exact marked spans rather than on the absence of exceptions.
//
// The module is plain JavaScript with no React, so it is evaluated directly by
// stripping the export keywords. That keeps the test on the real source rather
// than a copy that can drift.
import fs from 'node:fs';

const src = fs.readFileSync('src/lib/highlight.js', 'utf8')
  // Strip the export keywords so the source can be evaluated as a script.
  .replace(/^export /gm, '');

const factory = new Function(src + '\nreturn { highlight, stemOf, queryTerms, markMatches };');
const { highlight, stemOf } = factory();

const M = (s) => '\u0001' + s + '\u0002';
const build = (s) => M(s);
const flat = (r) => {
  if (typeof r === 'string') return r;
  return r.map((x) => (typeof x === 'string' ? x : flat(x))).join('');
};

let pass = 0, fail = 0;
function check(label, got, want) {
  if (got === want) { pass++; return; }
  fail++;
  console.log('  FAIL ' + label + '\n       got:  ' + JSON.stringify(got) + '\n       want: ' + JSON.stringify(want));
}

console.log('=== highlight() ===\n');

// Tier 1: the term as typed is marked whole, not truncated to its stem.
check('exact term marked whole',
  flat(highlight('the auditd service logs events', 'auditd', build)),
  'the ' + M('auditd') + ' service logs events');
check('case preserved in output',
  flat(highlight('Run IPConfig now', 'ipconfig', build)),
  'Run ' + M('IPConfig') + ' now');
check('word-start anchor: port does not match support',
  flat(highlight('we support the port', 'port', build)),
  'we support the ' + M('port'));
check('two terms',
  flat(highlight('ping the dns server', 'ping dns', build)),
  M('ping') + ' the ' + M('dns') + ' server');
check('repeated term marked every time',
  flat(highlight('port 80 and port 443', 'port', build)),
  M('port') + ' 80 and ' + M('port') + ' 443');
check('adjacent matches keep their separator',
  flat(highlight('auditd auditd', 'auditd', build)),
  M('auditd') + ' ' + M('auditd'));
check('match at start', flat(highlight('auditd is running', 'auditd', build)), M('auditd') + ' is running');
check('match at end', flat(highlight('running auditd', 'auditd', build)), 'running ' + M('auditd'));

// Tier 2: the index matches stems, so a stem hit must still be marked. Without
// this, searching "timestomping" shows module 11's "timestomped" result with
// nothing highlighted, which reads as a broken search.
check('stem fallback marks the different form',
  flat(highlight('the file was timestomped', 'timestomping', build)),
  'the file was ' + M('timestomp') + 'ed');

// Identifiers the curriculum actually contains must survive escaping intact.
check('underscore identifier',
  flat(highlight('see page_fault_in_nonpaged_area error', 'page_fault_in_nonpaged_area', build)),
  'see ' + M('page_fault_in_nonpaged_area') + ' error');
check('hyphenated cmdlet, case-insensitive',
  flat(highlight('run Get-ADPrincipalGroupMembership', 'get-adprincipalgroupmembership', build)),
  'run ' + M('Get-ADPrincipalGroupMembership'));
check('dotted quad',
  flat(highlight('open 127.0.0.1 now', '127.0.0.1', build)),
  'open ' + M('127.0.0.1') + ' now');
check('plus is literal', flat(highlight('use c++ here', 'c++', build)), 'use ' + M('c++') + ' here');

// Degenerate input must pass through unchanged rather than throw or blank out.
check('no match returns text unchanged', flat(highlight('nothing here', 'zzzz', build)), 'nothing here');
check('empty query', flat(highlight('some text', '', build)), 'some text');
check('null query', flat(highlight('some text', null, build)), 'some text');
check('empty text', flat(highlight('', 'auditd', build)), '');
check('one-character term is ignored', flat(highlight('a b c', 'a', build)), 'a b c');
check('single-char query marks nothing', flat(highlight('call Get-Item (x)', '(x)', build)), 'call Get-Item (x)');

// Anything that could break RegExp construction must not throw.
const nasty = ['[', '(', '*', '+', '?', '\\', '^', '$', '|', '()', '...', '   ', '!!!', 'a|b'];
for (const q of nasty) {
  let outcome = 'ok';
  try { flat(highlight('a [ bracket (x) * + ? \\ ^ $ | end', q, build)); }
  catch (e) { outcome = 'threw: ' + e.message; }
  check('no throw for ' + JSON.stringify(q), outcome, 'ok');
}

// A pathological input must still return promptly rather than backtracking.
const t0 = Date.now();
flat(highlight('a'.repeat(5000), 'a'.repeat(50), build));
check('long input returns promptly', Date.now() - t0 < 500, true);

console.log('\n=== stemOf() ===');
check('short term keeps minimum length 5', stemOf('abcd'), 'abcd');
check('longer term truncates to 75%', stemOf('timestomping'), 'timestomp');
check('exactly five', stemOf('abcde'), 'abcde');

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);